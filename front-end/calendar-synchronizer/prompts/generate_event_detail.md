make this schedule detail page
1. register it to path /schedule/:id
2. it should display the schedule details like title, description, date, time, and occurences (repeat every N interval)
3. it has a button to edit the schedule, which will toggle the edit mode, all details will be editable in the edit mode, and there will be a save button to save the changes

please refer to the screenshot i attached

please prioritize utilizing tamagui components as much as possible, you dont need to copy the exact same style as the attached screenshot

please use dummy hooks for data like : 
- get schedule detail for given id

please use dtos generated  by the openapi client in generated/openapi/dto to simulate the data in the frontend
- scheduleDto.ts

MAKE SURE THE CODE IS READABLE AND MAINTAINABLE WITH ATOMIC COMPONENTS