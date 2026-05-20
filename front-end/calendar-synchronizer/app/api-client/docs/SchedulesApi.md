# SchedulesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**schedulesControllerCreate**](#schedulescontrollercreate) | **POST** /schedules | |
|[**schedulesControllerCreateWithNaturalLanguage**](#schedulescontrollercreatewithnaturallanguage) | **POST** /schedules/natural-language | |
|[**schedulesControllerFindAll**](#schedulescontrollerfindall) | **GET** /schedules | |
|[**schedulesControllerFindOne**](#schedulescontrollerfindone) | **GET** /schedules/{id} | |
|[**schedulesControllerRemove**](#schedulescontrollerremove) | **DELETE** /schedules/{id} | |
|[**schedulesControllerSyncGoogleEvents**](#schedulescontrollersyncgoogleevents) | **POST** /schedules/sync/google | |
|[**schedulesControllerSyncMicrosoftEvents**](#schedulescontrollersyncmicrosoftevents) | **POST** /schedules/sync/microsoft | |
|[**schedulesControllerUpdate**](#schedulescontrollerupdate) | **PATCH** /schedules/{id} | |

# **schedulesControllerCreate**
> ScheduleDto schedulesControllerCreate(createScheduleDto)


### Example

```typescript
import {
    SchedulesApi,
    Configuration,
    CreateScheduleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let createScheduleDto: CreateScheduleDto; //

const { status, data } = await apiInstance.schedulesControllerCreate(
    createScheduleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createScheduleDto** | **CreateScheduleDto**|  | |


### Return type

**ScheduleDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerCreateWithNaturalLanguage**
> ScheduleDto schedulesControllerCreateWithNaturalLanguage(createScheduleNaturalLanguageDto)


### Example

```typescript
import {
    SchedulesApi,
    Configuration,
    CreateScheduleNaturalLanguageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let createScheduleNaturalLanguageDto: CreateScheduleNaturalLanguageDto; //

const { status, data } = await apiInstance.schedulesControllerCreateWithNaturalLanguage(
    createScheduleNaturalLanguageDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createScheduleNaturalLanguageDto** | **CreateScheduleNaturalLanguageDto**|  | |


### Return type

**ScheduleDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerFindAll**
> Array<ScheduleDto> schedulesControllerFindAll()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

const { status, data } = await apiInstance.schedulesControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ScheduleDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerFindOne**
> ScheduleDto schedulesControllerFindOne()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schedulesControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ScheduleDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerRemove**
> ScheduleDto schedulesControllerRemove()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schedulesControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ScheduleDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerSyncGoogleEvents**
> Array<ScheduleDto> schedulesControllerSyncGoogleEvents()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

const { status, data } = await apiInstance.schedulesControllerSyncGoogleEvents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ScheduleDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerSyncMicrosoftEvents**
> Array<ScheduleDto> schedulesControllerSyncMicrosoftEvents()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

const { status, data } = await apiInstance.schedulesControllerSyncMicrosoftEvents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ScheduleDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulesControllerUpdate**
> ScheduleDto schedulesControllerUpdate(updateScheduleDto)


### Example

```typescript
import {
    SchedulesApi,
    Configuration,
    UpdateScheduleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let id: string; // (default to undefined)
let updateScheduleDto: UpdateScheduleDto; //

const { status, data } = await apiInstance.schedulesControllerUpdate(
    id,
    updateScheduleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateScheduleDto** | **UpdateScheduleDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ScheduleDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

