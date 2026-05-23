import { useState, useCallback } from 'react';
import type { TaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Deletes a task (and its subtasks) with optimistic update.
 * Real API call: DELETE /tasks/:id
 *
 * Usage:
 *   const { deleteTask, isLoading, error } = useDeleteTask(setTasks);
 */

/** Collect all descendant IDs of a task node (including itself) */
function collectIds(tasks: TaskDto[], id: string): Set<string> {
  const ids = new Set<string>();

  function walk(nodes: TaskDto[]) {
    for (const node of nodes) {
      if (node.id === id || ids.has(node.id)) {
        // Found the target: collect it and all children
      }
    }
  }

  function collect(nodes: TaskDto[]) {
    for (const node of nodes) {
      if (node.id === id) {
        ids.add(node.id);
        collectChildren(node);
        return true;
      }
      if (node.subtasks && collect(node.subtasks)) {
        return true;
      }
    }
    return false;
  }

  function collectChildren(node: TaskDto) {
    if (!node.subtasks) return;
    for (const child of node.subtasks) {
      ids.add(child.id);
      collectChildren(child);
    }
  }

  collect(tasks);
  return ids;
}

/** Remove a task node (and all its subtasks) from the tree */
function removeFromTree(tasks: TaskDto[], idsToRemove: Set<string>): TaskDto[] {
  return tasks
    .filter((t) => !idsToRemove.has(t.id))
    .map((t) => ({
      ...t,
      subtasks: t.subtasks ? removeFromTree(t.subtasks, idsToRemove) : undefined,
    }));
}

export function useDeleteTask(
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useCallback(
    async (id: string) => {
      // Snapshot for rollback
      let snapshot: TaskDto[] = [];

      // Optimistic update: remove immediately from tree
      setTasks((prev) => {
        snapshot = prev;
        const idsToRemove = collectIds(prev, id);
        return removeFromTree(prev, idsToRemove);
      });

      setIsLoading(true);
      setError(null);

      try {

        await TaskService.removeTask(id);

      } catch (err) {

        setTasks(snapshot);
        setError(err instanceof Error ? err.message : 'Failed to delete task');

      } finally {
        setIsLoading(false);
      }
    },
    [setTasks],
  );

  return { deleteTask, isLoading, error };
}
