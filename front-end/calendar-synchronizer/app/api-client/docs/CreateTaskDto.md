# CreateTaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**description** | **object** |  | [optional] [default to undefined]
**deadline** | **object** |  | [optional] [default to undefined]
**created_at** | **object** |  | [optional] [default to undefined]
**completed** | **boolean** |  | [optional] [default to undefined]
**parent_task_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateTaskDto } from './api';

const instance: CreateTaskDto = {
    title,
    description,
    deadline,
    created_at,
    completed,
    parent_task_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
