[flexso-cf-tenantcache](../README.md) › [Globals](../globals.md) › ["flexsotenantcache"](../modules/_flexsotenantcache_.md) › [TenantCache](_flexsotenantcache_.tenantcache.md)

# Class: TenantCache

## Hierarchy

* **TenantCache**

## Index

### Constructors

* [constructor](_flexsotenantcache_.tenantcache.md#constructor)

### Properties

* [events](_flexsotenantcache_.tenantcache.md#private-events)
* [tenantCaches](_flexsotenantcache_.tenantcache.md#private-tenantcaches)
* [ttl](_flexsotenantcache_.tenantcache.md#private-ttl)

### Methods

* [del](_flexsotenantcache_.tenantcache.md#del)
* [flush](_flexsotenantcache_.tenantcache.md#flush)
* [flushAll](_flexsotenantcache_.tenantcache.md#flushall)
* [get](_flexsotenantcache_.tenantcache.md#get)
* [getSync](_flexsotenantcache_.tenantcache.md#getsync)
* [getTenantCache](_flexsotenantcache_.tenantcache.md#private-gettenantcache)
* [on](_flexsotenantcache_.tenantcache.md#on)
* [registerEvents](_flexsotenantcache_.tenantcache.md#private-registerevents)
* [set](_flexsotenantcache_.tenantcache.md#set)
* [getTtlHours](_flexsotenantcache_.tenantcache.md#static-getttlhours)
* [getTtlMinutes](_flexsotenantcache_.tenantcache.md#static-getttlminutes)

## Constructors

###  constructor

\+ **new TenantCache**(`ttl`: number): *[TenantCache](_flexsotenantcache_.tenantcache.md)*

*Defined in [flexsotenantcache.ts:31](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L31)*

create an instance of the tenant aware cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ttl` | number | standard time to live in seconds. 0 = infinity;  |

**Returns:** *[TenantCache](_flexsotenantcache_.tenantcache.md)*

## Properties

### `Private` events

• **events**: *object*

*Defined in [flexsotenantcache.ts:12](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L12)*

#### Type declaration:

* \[ **eventName**: *string*\]: [IEventFunction](../modules/_flexsotenantcache_.md#ieventfunction)[]

___

### `Private` tenantCaches

• **tenantCaches**: *object*

*Defined in [flexsotenantcache.ts:7](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L7)*

#### Type declaration:

* \[ **tenantName**: *string*\]: NodeCache

___

### `Private` ttl

• **ttl**: *number*

*Defined in [flexsotenantcache.ts:10](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L10)*

## Methods

###  del

▸ **del**(`tenantName`: string, `keys`: string | number | NodeCache.Key): *number*

*Defined in [flexsotenantcache.ts:91](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L91)*

Function to delete a value from cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tenantName` | string | Name of the current tenant |
`keys` | string &#124; number &#124; NodeCache.Key | - |

**Returns:** *number*

___

###  flush

▸ **flush**(`tenantName`: string): *void*

*Defined in [flexsotenantcache.ts:100](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L100)*

Function to clear the cache for a specific tenant.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tenantName` | string | Name of the tenant   |

**Returns:** *void*

___

###  flushAll

▸ **flushAll**(): *void*

*Defined in [flexsotenantcache.ts:108](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L108)*

Function to clear the cache for all tenants.

**Returns:** *void*

___

###  get

▸ **get**‹**T**›(`tenantName`: string, `key`: NodeCache.Key, `storeFn?`: undefined | function): *Promise‹undefined | T›*

*Defined in [flexsotenantcache.ts:52](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L52)*

Async function to get a key from the cache.
This function is async because the stroreFunction can be an async function to retrieve the value.

**Type parameters:**

▪ **T**

This is the type of the value that is stored or retrieved from the cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tenantName` | string | Name of the current tenant |
`key` | NodeCache.Key | Key of the value to retrieve |
`storeFn?` | undefined &#124; function | - |

**Returns:** *Promise‹undefined | T›*

___

###  getSync

▸ **getSync**‹**T**›(`tenantName`: string, `key`: NodeCache.Key): *undefined | T*

*Defined in [flexsotenantcache.ts:69](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L69)*

Sync function to get a key from the cache.

**Type parameters:**

▪ **T**

This is the type of the value that is retrieved from the cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tenantName` | string | Name of the current tenant |
`key` | NodeCache.Key | Key of the value to retrieve  |

**Returns:** *undefined | T*

___

### `Private` getTenantCache

▸ **getTenantCache**(`tenantName`: string): *NodeCache‹›*

*Defined in [flexsotenantcache.ts:142](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`tenantName` | string |

**Returns:** *NodeCache‹›*

___

###  on

▸ **on**(`eventName`: any, `eventFn`: [IEventFunction](../modules/_flexsotenantcache_.md#ieventfunction)): *void*

*Defined in [flexsotenantcache.ts:120](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L120)*

This function can be used to add events to a tenant cache.

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | any |
`eventFn` | [IEventFunction](../modules/_flexsotenantcache_.md#ieventfunction) |

**Returns:** *void*

___

### `Private` registerEvents

▸ **registerEvents**(`tenantCache`: NodeCache): *void*

*Defined in [flexsotenantcache.ts:134](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L134)*

**Parameters:**

Name | Type |
------ | ------ |
`tenantCache` | NodeCache |

**Returns:** *void*

___

###  set

▸ **set**‹**T**›(`tenantName`: string, `key`: NodeCache.Key, `value`: T): *boolean*

*Defined in [flexsotenantcache.ts:82](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L82)*

Function to set a value in the cache.

**Type parameters:**

▪ **T**

This is the type of the value that is stored in the cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tenantName` | string | Name of the current tenant |
`key` | NodeCache.Key | Key of the value to set |
`value` | T | The value to store it in the cache.  |

**Returns:** *boolean*

___

### `Static` getTtlHours

▸ **getTtlHours**(`hours`: number): *number*

*Defined in [flexsotenantcache.ts:20](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L20)*

TTL of the cache is in seconds.
This function converts hours in seconds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hours` | number | number of hours |

**Returns:** *number*

the given number of hours in seconds

___

### `Static` getTtlMinutes

▸ **getTtlMinutes**(`minutes`: number): *number*

*Defined in [flexsotenantcache.ts:29](https://github.com/jowavp/flexso-cf-tenantcache/blob/599acbb/src/flexsotenantcache.ts#L29)*

TTL of the cache is in seconds.
This function converts minutes in seconds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`minutes` | number | number of minutes |

**Returns:** *number*

the given number of minutes in seconds
