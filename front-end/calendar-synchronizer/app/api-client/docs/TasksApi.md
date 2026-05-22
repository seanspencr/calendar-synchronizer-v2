# TasksApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tasksControllerCreate**](#taskscontrollercreate) | **POST** /tasks | |
|[**tasksControllerFindAll**](#taskscontrollerfindall) | **GET** /tasks | |
|[**tasksControllerFindOne**](#taskscontrollerfindone) | **GET** /tasks/{id} | |
|[**tasksControllerRemove**](#taskscontrollerremove) | **DELETE** /tasks/{id} | |
|[**tasksControllerUpdate**](#taskscontrollerupdate) | **PATCH** /tasks/{id} | |

# **tasksControllerCreate**
> TaskDto tasksControllerCreate(createTaskDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    CreateTaskDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let createTaskDto: CreateTaskDto; //

const { status, data } = await apiInstance.tasksControllerCreate(
    createTaskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTaskDto** | **CreateTaskDto**|  | |


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerFindAll**
> Array<TaskDto> tasksControllerFindAll()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

const { status, data } = await apiInstance.tasksControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TaskDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerFindOne**
> TaskDto tasksControllerFindOne()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tasksControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerRemove**
> TaskDto tasksControllerRemove()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tasksControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerUpdate**
> TaskDto tasksControllerUpdate(updateTaskDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    UpdateTaskDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; // (default to undefined)
let updateTaskDto: UpdateTaskDto; //

const { status, data } = await apiInstance.tasksControllerUpdate(
    id,
    updateTaskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskDto** | **UpdateTaskDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

