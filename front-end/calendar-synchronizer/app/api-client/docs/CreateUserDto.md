# CreateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **string** |  | [default to undefined]
**password** | **string** |  | [default to undefined]
**google_email** | **string** |  | [default to undefined]
**microsoft_email** | **string** |  | [default to undefined]
**google_refresh_token** | **object** |  | [optional] [default to undefined]
**microsoft_refresh_token** | **object** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateUserDto } from './api';

const instance: CreateUserDto = {
    username,
    password,
    google_email,
    microsoft_email,
    google_refresh_token,
    microsoft_refresh_token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
