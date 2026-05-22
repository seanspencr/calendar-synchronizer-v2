# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerBindGoogle**](#authcontrollerbindgoogle) | **POST** /auth/google/bind | |
|[**authControllerBindMicrosoft**](#authcontrollerbindmicrosoft) | **POST** /auth/microsoft/bind | |
|[**authControllerDummyGoogleLogin**](#authcontrollerdummygooglelogin) | **POST** /auth/google/dummy | |
|[**authControllerDummyMicrosoftLogin**](#authcontrollerdummymicrosoftlogin) | **POST** /auth/microsoft/dummy | |
|[**authControllerGoogleAuthCallback**](#authcontrollergoogleauthcallback) | **GET** /auth/register/google/callback | |
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /auth/login | |
|[**authControllerMe**](#authcontrollerme) | **GET** /auth/me | |
|[**authControllerRegisterGoogleUser**](#authcontrollerregistergoogleuser) | **POST** /auth/google | |
|[**authControllerRegisterMicrosoftUser**](#authcontrollerregistermicrosoftuser) | **POST** /auth/microsoft | |

# **authControllerBindGoogle**
> UserDto authControllerBindGoogle(googleAuthDto)

Bind Google account to existing user

### Example

```typescript
import {
    AuthApi,
    Configuration,
    GoogleAuthDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let googleAuthDto: GoogleAuthDto; //

const { status, data } = await apiInstance.authControllerBindGoogle(
    googleAuthDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **googleAuthDto** | **GoogleAuthDto**|  | |


### Return type

**UserDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User bound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerBindMicrosoft**
> UserDto authControllerBindMicrosoft(microsoftAuthDto)

Bind Microsoft account to existing user

### Example

```typescript
import {
    AuthApi,
    Configuration,
    MicrosoftAuthDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let microsoftAuthDto: MicrosoftAuthDto; //

const { status, data } = await apiInstance.authControllerBindMicrosoft(
    microsoftAuthDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **microsoftAuthDto** | **MicrosoftAuthDto**|  | |


### Return type

**UserDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User bound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerDummyGoogleLogin**
> LoginResponseDto authControllerDummyGoogleLogin(dummyGoogleLoginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    DummyGoogleLoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let dummyGoogleLoginDto: DummyGoogleLoginDto; //

const { status, data } = await apiInstance.authControllerDummyGoogleLogin(
    dummyGoogleLoginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dummyGoogleLoginDto** | **DummyGoogleLoginDto**|  | |


### Return type

**LoginResponseDto**

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

# **authControllerDummyMicrosoftLogin**
> LoginResponseDto authControllerDummyMicrosoftLogin(dummyMicrosoftLoginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    DummyMicrosoftLoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let dummyMicrosoftLoginDto: DummyMicrosoftLoginDto; //

const { status, data } = await apiInstance.authControllerDummyMicrosoftLogin(
    dummyMicrosoftLoginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dummyMicrosoftLoginDto** | **DummyMicrosoftLoginDto**|  | |


### Return type

**LoginResponseDto**

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

# **authControllerGoogleAuthCallback**
> authControllerGoogleAuthCallback()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerGoogleAuthCallback();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogin**
> LoginResponseDto authControllerLogin(loginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.authControllerLogin(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

**LoginResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerMe**
> MeResponseDto authControllerMe()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MeResponseDto**

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

# **authControllerRegisterGoogleUser**
> LoginResponseDto authControllerRegisterGoogleUser(googleAuthDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    GoogleAuthDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let googleAuthDto: GoogleAuthDto; //

const { status, data } = await apiInstance.authControllerRegisterGoogleUser(
    googleAuthDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **googleAuthDto** | **GoogleAuthDto**|  | |


### Return type

**LoginResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegisterMicrosoftUser**
> LoginResponseDto authControllerRegisterMicrosoftUser(microsoftAuthDto)

Register NEW user with Microsoft OAuth2

### Example

```typescript
import {
    AuthApi,
    Configuration,
    MicrosoftAuthDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let microsoftAuthDto: MicrosoftAuthDto; //

const { status, data } = await apiInstance.authControllerRegisterMicrosoftUser(
    microsoftAuthDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **microsoftAuthDto** | **MicrosoftAuthDto**|  | |


### Return type

**LoginResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

