# TaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**parent_task_id** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**deadline** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**user_id** | **string** |  | [default to undefined]
**completed** | **boolean** |  | [default to undefined]
**subtasks** | [**Array&lt;TaskDto&gt;**](TaskDto.md) |  | [optional] [default to undefined]
**is_todo** | **boolean** |  | [default to undefined]

## Example

```typescript
import { TaskDto } from './api';

const instance: TaskDto = {
    id,
    title,
    parent_task_id,
    description,
    deadline,
    created_at,
    user_id,
    completed,
    subtasks,
    is_todo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
