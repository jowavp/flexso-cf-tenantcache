"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
class TenantCache {
    /**
     * TTL of the cache is in seconds.
     * This function converts hours in seconds.
     * @param hours number of hours
     * @returns the given number of hours in seconds
     */
    static getTtlHours(hours) {
        return 60 * 60 * hours;
    }
    /**
     * TTL of the cache is in seconds.
     * This function converts minutes in seconds.
     * @param minutes number of minutes
     * @returns the given number of minutes in seconds
     */
    static getTtlMinutes(minutes) {
        return 60 * minutes;
    }
    /**
     * create an instance of the tenant aware cache.
     * @param ttl standard time to live in seconds. 0 = infinity;
     */
    constructor(ttl) {
        this.events = {};
        this.ttl = ttl;
        this.tenantCaches = {};
    }
    /**
     * Async function to get a key from the cache.
     * This function is async because the stroreFunction can be an async function to retrieve the value.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to retrieve
     * @param {()=>Promise<T>} [storeFn] if the key is not found, this function is executed to retrieve the value to store it in the cache.
     *
     * @template T This is the type of the value that is stored or retrieved from the cache.
     */
    async get(tenantName, key, storeFn) {
        const tenantCache = this.getTenantCache(tenantName);
        if (storeFn && !tenantCache.has(key)) {
            tenantCache.set(key, await storeFn());
        }
        return tenantCache.get(key);
    }
    /**
     * Sync function to get a key from the cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to retrieve
     *
     * @template T This is the type of the value that is retrieved from the cache.
     */
    getSync(tenantName, key) {
        const tenantCache = this.getTenantCache(tenantName);
        return tenantCache.get(key);
    }
    /**
     * Function to set a value in the cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to set
     * @param {T} value The value to store it in the cache.
     *
     * @template T This is the type of the value that is stored in the cache.
     */
    set(tenantName, key, value, ttl = this.ttl) {
        return this.getTenantCache(tenantName).set(key, value, ttl);
    }
    /**
     * Function to delete a value from cache.
     * @param {string} tenantName Name of the current tenant
     * @param {string | number} key Key of the value to remove
     *
     */
    del(tenantName, keys) {
        return this.getTenantCache(tenantName).del(keys);
    }
    /**
     * Function to clear the cache for a specific tenant.
     * @param {string} tenantName Name of the tenant
     *
     */
    flush(tenantName) {
        return this.getTenantCache(tenantName).flushAll();
    }
    /**
     * Function to clear the cache for all tenants.
     */
    flushAll() {
        Object.keys(this.tenantCaches).forEach((k) => {
            this.tenantCaches[k].flushAll();
            delete this.tenantCaches[k];
        });
    }
    /**
     * This function can be used to add events to a tenant cache.
     */
    on(eventName, eventFn) {
        // add event function to list
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events.eventName.push(eventFn);
        // register the event on all existing caches.
        Object.values(this.tenantCaches).forEach((c) => c.on(eventName, eventFn));
    }
    /**
     * This function returns a map of statistics for each tenant cache in the object.
     * @returns A Map object containing the statistics of each tenant cache in the current object's
     * `tenantCaches` property. The keys of the Map are the names of the tenants and the values are the
     * statistics of their respective caches.
     */
    getStats() {
        return Object.keys(this.tenantCaches).reduce((acc, tenantName) => acc.set(tenantName, this.tenantCaches[tenantName].getStats()), new Map());
    }
    registerEvents(tenantCache) {
        Object.entries(this.events).forEach(([key, events]) => {
            events.forEach((eFn) => tenantCache.on(key, eFn));
        });
    }
    getTenantCache(tenantName) {
        if (!this.tenantCaches[tenantName]) {
            this.tenantCaches[tenantName] = new node_cache_1.default({
                stdTTL: this.ttl,
                checkperiod: this.ttl * 0.2,
                useClones: false,
            });
            this.registerEvents(this.tenantCaches[tenantName]);
        }
        return this.tenantCaches[tenantName];
    }
}
exports.default = TenantCache;
//# sourceMappingURL=flexsotenantcache.js.map