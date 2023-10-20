/// <reference types="node" />
import { Cluster } from "cluster";
import NodeCache from "node-cache";
export default class TenantClusterCache {
    private namespace;
    private ttl;
    private cache?;
    private resolvers;
    constructor(cluster: Cluster, namespace: string, ttl: number);
    private prefixData;
    get<T>(tenantName: string, key: NodeCache.Key, storeFn?: () => Promise<T>): Promise<unknown>;
    set<T>(tenantName: string, key: NodeCache.Key, val: T, ttl?: number): boolean | Promise<unknown>;
    flush(tenantName: string): void | Promise<unknown>;
    getStats(): Promise<unknown> | Map<string, NodeCache.Stats>;
}
