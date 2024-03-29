import NodeCache from "node-cache";
export type IEventFunction = (key?: NodeCache.Key, value?: any) => void;
export default class TenantCache {
    private tenantCaches;
    private ttl;
    private events;
    /**
     * TTL of the cache is in seconds.
     * This function converts hours in seconds.
     * @param hours number of hours
     * @returns the given number of hours in seconds
     */
    static getTtlHours(hours: number): number;
    /**
     * TTL of the cache is in seconds.
     * This function converts minutes in seconds.
     * @param minutes number of minutes
     * @returns the given number of minutes in seconds
     */
    static getTtlMinutes(minutes: number): number;
    /**
     * create an instance of the tenant aware cache.
     * @param ttl standard time to live in seconds. 0 = infinity;
     */
    constructor(ttl: number);
    /**
     * Async function to get a key from the cache.
     * This function is async because the stroreFunction can be an async function to retrieve the value.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to retrieve
     * @param {()=>Promise<T>} [storeFn] if the key is not found, this function is executed to retrieve the value to store it in the cache.
     *
     * @template T This is the type of the value that is stored or retrieved from the cache.
     */
    get<T>(tenantName: string, key: NodeCache.Key, storeFn?: () => Promise<T>): Promise<T | undefined>;
    /**
     * Sync function to get a key from the cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to retrieve
     *
     * @template T This is the type of the value that is retrieved from the cache.
     */
    getSync<T>(tenantName: string, key: NodeCache.Key): T | undefined;
    /**
     * Function to set a value in the cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to set
     * @param {T} value The value to store it in the cache.
     *
     * @template T This is the type of the value that is stored in the cache.
     */
    set<T>(tenantName: string, key: NodeCache.Key, value: T, ttl?: number): boolean;
    /**
     * Function to delete a value from cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to remove
     *
     */
    del(tenantName: string, keys: string | number | NodeCache.Key): number;
    /**
     * Function to clear the cache for a specific tenant.
     * @param {string} tenantName Name of the tenant
     *
     */
    flush(tenantName: string): void;
    /**
     * Function to clear the cache for all tenants.
     */
    flushAll(): void;
    /**
     * This function can be used to add events to a tenant cache.
     */
    on(eventName: any, eventFn: IEventFunction): void;
    /**
     * This function returns a map of statistics for each tenant cache in the object.
     * @returns A Map object containing the statistics of each tenant cache in the current object's
     * `tenantCaches` property. The keys of the Map are the names of the tenants and the values are the
     * statistics of their respective caches.
     */
    getStats(): Map<string, NodeCache.Stats>;
    private registerEvents;
    private getTenantCache;
}
