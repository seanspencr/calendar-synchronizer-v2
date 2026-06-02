# ScheduleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**external_event_id** | **string** |  | [default to undefined]
**id** | **string** |  | [default to undefined]
**event** | **string** |  | [default to undefined]
**event_date** | **string** |  | [default to undefined]
**start_time** | **string** |  | [default to undefined]
**end_time** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**schedule_recurrence_id** | **string** |  | [default to undefined]
**created_by** | **string** |  | [default to undefined]
**schedule_provider** | **object** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**recurrence** | [**RecurrenceDto**](RecurrenceDto.md) |  | [default to undefined]

## Example

```typescript
import { ScheduleDto } from './api';

const instance: ScheduleDto = {
    external_event_id,
    id,
    event,
    event_date,
    start_time,
    end_time,
    created_at,
    schedule_recurrence_id,
    created_by,
    schedule_provider,
    description,
    recurrence,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
