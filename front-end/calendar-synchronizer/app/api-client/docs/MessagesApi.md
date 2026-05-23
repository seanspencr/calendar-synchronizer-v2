# MessagesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**messagesControllerCreate**](#messagescontrollercreate) | **POST** /messages | |
|[**messagesControllerFindToday**](#messagescontrollerfindtoday) | **GET** /messages | |

# **messagesControllerCreate**
> MessageDto messagesControllerCreate(createMessageDto)


### Example

```typescript
import {
    MessagesApi,
    Configuration,
    CreateMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let createMessageDto: CreateMessageDto; //

const { status, data } = await apiInstance.messagesControllerCreate(
    createMessageDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createMessageDto** | **CreateMessageDto**|  | |


### Return type

**MessageDto**

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

# **messagesControllerFindToday**
> Array<MessageDto> messagesControllerFindToday()


### Example

```typescript
import {
    MessagesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

const { status, data } = await apiInstance.messagesControllerFindToday();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MessageDto>**

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

