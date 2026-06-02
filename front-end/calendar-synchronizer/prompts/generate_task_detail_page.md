create a new subfolder called /task

create a new page for task detail with path task/:id

the page visual should be similar to eventdetail and dashboard page, only the displayed data is different :
- task description
- subtasks (will be provided from backend as a list fo task)
- parent task (will be provided from backend as a taskId)
- task deadline


please refer to the screenshot i attached

please prioritize utilizing tamagui components as much as possible, you dont need to copy the exact same style as the attached screenshot

please use dummy hooks for data like : 
- get task detail
- get user by id
- get task by id

user can toggle the mode into edit mode (just like the event detail page), and can exit the editing mde by saving

this is the example schema for the data I will use, for userId and parentTaskId, yu shoudl display the username and taskname instead. make the parentTask clickable and redirect to the parent task id if exist.


export interface CreateTaskDto {
    'title': string;
    'description'?: object;
    'deadline'?: object;
    'created_at'?: object;
    'completed': object;
    'parent_task_id': object;
}

dashboard's tasklist should be clickable  and will redirect to task/:id page (except the checkbox, since the checkbox will be used to toggle)

taskDetailPage should contain a back button to reverse to the preious step

