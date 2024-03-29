"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flexsotenantcache_1 = __importDefault(require("./flexsotenantcache"));
const crypto_1 = require("crypto");
const UNDEFINED_KEY_ERROR = "Undefined or null key";
function msgId(msg) {
    return `${msg.tenantName}_${msg.method}_${msg.key}_${msg.timestamp}`;
}
function prefixDataFn(namespace) {
    return (data) => {
        return {
            clusternodecache: true,
            namespace,
            ...data,
        };
    };
}
function incomingMessage(namespace, cache) {
    const prefixData = prefixDataFn(namespace);
    return async (worker, msg) => {
        // validate this message is for us
        if (!msg.clusternodecache) {
            return;
        }
        if (msg.namespace && namespace && msg.namespace != namespace) {
            // for another cache (namespace)
            return;
        }
        if ((msg.method === "get" || msg.method === "set" || msg.method === "del") &&
            (msg.key === undefined || msg.key === null)) {
            worker.send(prefixData({
                sig: msgId(msg),
                body: {
                    err: UNDEFINED_KEY_ERROR,
                },
            }));
            return;
        }
        let value;
        switch (msg.method) {
            case "set":
                value = cache.set(msg.tenantName, msg.key, msg.val, msg.ttl);
                worker.send(prefixData({
                    sig: msgId(msg),
                    body: { value },
                }));
                break;
            case "get":
                try {
                    value = await cache.get(msg.tenantName, msg.key);
                    worker.send(prefixData({
                        sig: msgId(msg),
                        body: { value },
                    }));
                }
                catch (error) { }
                break;
            case "del":
                value = cache.del(msg.tenantName, msg.key);
                worker.send(prefixData({
                    sig: msgId(msg),
                    body: { value },
                }));
                break;
            case "getStats":
                worker.send(prefixData({
                    sig: msgId(msg),
                    body: { value: cache.getStats() },
                }));
                break;
            case "flushAll":
                cache.flush(msg.tenantName);
                worker.send(prefixData({
                    sig: msgId(msg),
                    body: { value: cache.getStats() },
                }));
                break;
        }
    };
}
class TenantClusterCache {
    constructor(cluster, namespace, ttl) {
        this.namespace = namespace;
        this.ttl = ttl;
        this.resolvers = {};
        if (cluster.isPrimary && !process.env.DEBUG) {
            var cache = new flexsotenantcache_1.default(ttl);
            cluster.on("online", function (worker) {
                worker.on("message", incomingMessage(namespace, cache).bind(null, worker));
            });
        }
        else {
            process.on("message", async (msg) => {
                var _a;
                // validate this message is for us
                if (!msg.clusternodecache) {
                    return;
                }
                if (msg.namespace &&
                    this.namespace &&
                    msg.namespace != this.namespace) {
                    // for another cache (namespace)
                    return;
                }
                if (msg.sig && this.resolvers[msg.sig]) {
                    this.resolvers[msg.sig]((_a = msg.body) === null || _a === void 0 ? void 0 : _a.value);
                    delete this.resolvers[msg.sig];
                }
            });
        }
    }
    prefixData(message) {
        return prefixDataFn(this.namespace)(message);
    }
    async get(tenantName, key, storeFn) {
        if (this.cache) {
            return this.cache.get(tenantName, key, storeFn);
        }
        return new Promise((resolve, reject) => {
            var timestamp = (0, crypto_1.randomUUID)().toString();
            const message = this.prefixData({
                method: "get",
                tenantName,
                timestamp,
                key,
            });
            if (process === null || process === void 0 ? void 0 : process.send) {
                const msgKey = msgId(message);
                this.resolvers[msgKey] = resolve;
                process.send(message);
            }
            else {
                reject("no process to send message");
            }
        });
    }
    set(tenantName, key, val, ttl = this.ttl) {
        if (this.cache) {
            return this.cache.set(tenantName, key, val, ttl);
        }
        return new Promise((resolve, reject) => {
            var timestamp = (0, crypto_1.randomUUID)().toString();
            const message = this.prefixData({
                method: "set",
                tenantName,
                timestamp,
                key,
                val,
                ttl,
            });
            if (process === null || process === void 0 ? void 0 : process.send) {
                const msgKey = msgId(message);
                this.resolvers[msgKey] = resolve;
                process.send(message);
            }
            else {
                reject("no process to send message");
            }
        });
    }
    flush(tenantName) {
        if (this.cache) {
            return this.cache.flush(tenantName);
        }
        return new Promise((resolve, reject) => {
            var timestamp = (0, crypto_1.randomUUID)().toString();
            const message = this.prefixData({
                method: "flushAll",
                tenantName,
                timestamp,
            });
            if (process === null || process === void 0 ? void 0 : process.send) {
                const msgKey = msgId(message);
                this.resolvers[msgKey] = resolve;
                process.send(message);
            }
            else {
                reject("no process to send message");
            }
        });
    }
    getStats() {
        if (this.cache) {
            return this.cache.getStats();
        }
        return new Promise((resolve, reject) => {
            var timestamp = (0, crypto_1.randomUUID)().toString();
            const message = this.prefixData({
                method: "flushAll",
                tenantName: "all",
                timestamp,
            });
            if (process === null || process === void 0 ? void 0 : process.send) {
                const msgKey = msgId(message);
                this.resolvers[msgKey] = resolve;
                process.send(message);
            }
            else {
                reject("no process to send message");
            }
        });
    }
}
exports.default = TenantClusterCache;
//# sourceMappingURL=flexsotenantclustercache.js.map