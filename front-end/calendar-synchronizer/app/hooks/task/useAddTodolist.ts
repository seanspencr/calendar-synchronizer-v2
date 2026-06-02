import { useEffect, useState } from "react";
import { TaskDto } from "../../api-client";
import { TaskService } from "@/app/services/taskService";

export function useAddTodolist(
    setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>
) {

    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    let snapshot: TaskDto[] = []

    async function update(taskId: string, isTodo: boolean) {
        setIsLoading(true)

        // optimistic update
        setTasks((prev) => {
            snapshot = prev
            return prev.map((task) => task.id === taskId ? ({ ...task, is_todo: isTodo }) : task)
        })

        try {
            const res = await TaskService.updateTask(taskId, {
                is_todo: isTodo
            })
        } catch (error) {
            setTasks(snapshot)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    return { update, isError, isLoading }
}