import { Cluster } from "cluster";
import TenantCache from "./flexsotenantcache";
import NodeCache from "node-cache";
import { randomUUID } from "crypto";

const UNDEFINED_KEY_ERROR = "Undefined or null key";

interface IProcessMessage {
  clusternodecache?: boolean;
  namespace?: string;
}

interface IProcessMessageOut extends IProcessMessage {
  sig: string;
  body: {
    err?: string;
    success?: any;
    value?: any;
  };
}

interface IProcessMessageIn extends IProcessMessage {
  tenantName: string;
  method: "get" | "set" | "del" | "getStats" | "flushAll";
  key?: NodeCache.Key;
  timestamp: string;
  val?: any;
  ttl?: number;
}

function msgId(msg: IProcessMessageIn) {
  return `${msg.tenantName}_${msg.method}_${msg.key}_${msg.timestamp}`;
}

function prefixDataFn(namespace: string) {
  return (data: IProcessMessageIn | IProcessMessageOut) => {
    return {
      clusternodecache: true,
      namespace,
      ...data,
    };
  };
}

function incomingMessage(namespace: string, cache: TenantCache) {
  const prefixData = prefixDataFn(namespace);
  return async (worker, msg: IProcessMessageIn) => {
    // validate this message is for us
    if (!msg.clusternodecache) {
      return;
    }

    if (msg.namespace && namespace && msg.namespace != namespace) {
      // for another cache (namespace)
      return;
    }

    if (
      (msg.method === "get" || msg.method === "set" || msg.method === "del") &&
      (msg.key === undefined || msg.key === null)
    ) {
      worker.send(
        prefixData({
          sig: msgId(msg),
          body: {
            err: UNDEFINED_KEY_ERROR,
          },
        })
      );
      return;
    }

    let value: any;
    switch (msg.method) {
      case "set":
        value = cache.set(msg.tenantName, msg.key!, msg.val, msg.ttl);
        worker.send(
          prefixData({
            sig: msgId(msg),
            body: { value },
          })
        );
        break;
      case "get":
        try {
          value = await cache.get<any>(msg.tenantName, msg.key!);
          worker.send(
            prefixData({
              sig: msgId(msg),
              body: { value },
            })
          );
        } catch (error) {}

        break;
      case "del":
        value = cache.del(msg.tenantName, msg.key!);
        worker.send(
          prefixData({
            sig: msgId(msg),
            body: { value },
          })
        );
        break;
      case "getStats":
        worker.send(
          prefixData({
            sig: msgId(msg),
            body: { value: cache.getStats() },
          })
        );
        break;
      case "flushAll":
        cache.flush(msg.tenantName);
        worker.send(
          prefixData({
            sig: msgId(msg),
            body: { value: cache.getStats() },
          })
        );
        break;
    }
  };
}

export default class TenantClusterCache {
  private cache?: TenantCache;
  private resolvers: { [key: string]: (value: unknown) => void } = {};

  constructor(
    cluster: Cluster,
    private namespace: string,
    private ttl: number
  ) {
    if (cluster.isPrimary && !process.env.DEBUG) {
      var cache = new TenantCache(ttl);

      cluster.on("online", function (worker) {
        worker.on(
          "message",
          incomingMessage(namespace, cache).bind(null, worker)
        );
      });
    } else {
      process.on("message", async (msg: IProcessMessageOut) => {
        // validate this message is for us
        if (!msg.clusternodecache) {
          return;
        }

        if (
          msg.namespace &&
          this.namespace &&
          msg.namespace != this.namespace
        ) {
          // for another cache (namespace)
          return;
        }

        if (msg.sig && this.resolvers[msg.sig]) {
          this.resolvers[msg.sig](msg.body?.value);
          delete this.resolvers[msg.sig];
        }
      });
    }
  }

  private prefixData(message: IProcessMessageIn) {
    return prefixDataFn(this.namespace)(message) as IProcessMessageIn;
  }

  async get<T>(
    tenantName: string,
    key: NodeCache.Key,
    storeFn?: () => Promise<T>
  ) {
    if (this.cache) {
      return this.cache.get(tenantName, key, storeFn);
    }

    return new Promise((resolve, reject) => {
      var timestamp = randomUUID().toString();
      const message = this.prefixData({
        method: "get",
        tenantName,
        timestamp,
        key,
      });
      if (process?.send) {
        const msgKey = msgId(message);
        this.resolvers[msgKey] = resolve;
        process.send(message);
      } else {
        reject("no process to send message");
      }
    });
  }

  set<T>(
    tenantName: string,
    key: NodeCache.Key,
    val: T,
    ttl: number = this.ttl
  ) {
    if (this.cache) {
      return this.cache.set(tenantName, key, val, ttl);
    }

    return new Promise((resolve, reject) => {
      var timestamp = randomUUID().toString();
      const message = this.prefixData({
        method: "set",
        tenantName,
        timestamp,
        key,
        val,
        ttl,
      });
      if (process?.send) {
        const msgKey = msgId(message);
        this.resolvers[msgKey] = resolve;
        process.send(message);
      } else {
        reject("no process to send message");
      }
    });
  }

  flush(tenantName: string) {
    if (this.cache) {
      return this.cache.flush(tenantName);
    }

    return new Promise((resolve, reject) => {
      var timestamp = randomUUID().toString();
      const message = this.prefixData({
        method: "flushAll",
        tenantName,
        timestamp,
      });
      if (process?.send) {
        const msgKey = msgId(message);
        this.resolvers[msgKey] = resolve;
        process.send(message);
      } else {
        reject("no process to send message");
      }
    });
  }

  getStats() {
    if (this.cache) {
      return this.cache.getStats();
    }

    return new Promise((resolve, reject) => {
      var timestamp = randomUUID().toString();
      const message = this.prefixData({
        method: "flushAll",
        tenantName: "all",
        timestamp,
      });
      if (process?.send) {
        const msgKey = msgId(message);
        this.resolvers[msgKey] = resolve;
        process.send(message);
      } else {
        reject("no process to send message");
      }
    });
  }
}
