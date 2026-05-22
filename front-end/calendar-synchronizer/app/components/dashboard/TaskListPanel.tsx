import React, { useState, useCallback } from 'react';
import { YStack, XStack, Text, Checkbox, ScrollView } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import type { TaskDto } from '../../api-client';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Recursively count all incomplete tasks in a subtree */
function countActiveTasks(tasks: TaskDto[]): number {
  return tasks.reduce((sum, t) => {
    const selfCount = t.completed ? 0 : 1;
    const childCount = t.subtasks ? countActiveTasks(t.subtasks) : 0;
    return sum + selfCount + childCount;
  }, 0);
}

// ─── Context menu state ───────────────────────────────────────────────────────

interface ContextMenuState {
  task: TaskDto;
  x: number;
  y: number;
}

// ─── Context menu popover ─────────────────────────────────────────────────────

function TaskContextMenu({
  menu,
  onToggle,
  onAddSubtask,
  onClose,
}: {
  menu: ContextMenuState;
  onToggle: (id: string) => void;
  onAddSubtask: (task: TaskDto) => void;
  onClose: () => void;
}) {
  const handleToggle = useCallback(() => {
    onToggle(menu.task.id);
    onClose();
  }, [onToggle, menu.task.id, onClose]);

  const handleAddSubtask = useCallback(() => {
    onAddSubtask(menu.task);
    onClose();
  }, [onAddSubtask, menu.task, onClose]);

  return (
    <>
      {/* Invisible full-screen backdrop to catch outside-clicks */}
      <YStack
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9998}
        onPress={onClose}
      />

      {/* Floating popover card */}
      <YStack
        position="fixed"
        // @ts-ignore – web-only style prop
        style={{ left: menu.x, top: menu.y }}
        zIndex={9999}
        backgroundColor="$color2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color5"
        overflow="hidden"
        minWidth={180}
        // @ts-ignore – web shadow
        boxShadow="0 8px 24px rgba(0,0,0,0.35)"
      >
        {/* Toggle */}
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2.5"
          gap="$2.5"
          alignItems="center"
          hoverStyle={{ backgroundColor: '$color3' }}
          pressStyle={{ opacity: 0.8 }}
          cursor="pointer"
          onPress={handleToggle}
        >
          <Feather
            name={menu.task.completed ? 'x-circle' : 'check-circle'}
            size={15}
            color={menu.task.completed ? '#f87171' : '#4ade80'}
          />
          <Text fontSize="$3" color="$color12">
            {menu.task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </XStack>

        {/* Divider */}
        <YStack height={1} backgroundColor="$color4" />

        {/* Add Subtask */}
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2.5"
          gap="$2.5"
          alignItems="center"
          hoverStyle={{ backgroundColor: '$color3' }}
          pressStyle={{ opacity: 0.8 }}
          cursor="pointer"
          onPress={handleAddSubtask}
        >
          <Feather name="corner-down-right" size={15} color="#8fb87a" />
          <Text fontSize="$3" color="$color12">
            Add Subtask
          </Text>
        </XStack>
      </YStack>
    </>
  );
}

// ─── Recursive task tree item ─────────────────────────────────────────────────

const INDENT_PX = 16; // px of indent per depth level

interface TaskTreeItemProps {
  task: TaskDto;
  depth: number;
  onToggle: (id: string) => void;
  onContextMenu: (task: TaskDto, x: number, y: number) => void;
  router: ReturnType<typeof useRouter>;
}

function TaskTreeItem({ task, depth, onToggle, onContextMenu, router }: TaskTreeItemProps) {
  const hasChildren = Boolean(task.subtasks && task.subtasks.length > 0);
  const [expanded, setExpanded] = useState(true);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(task, e.clientX, e.clientY);
    },
    [task, onContextMenu],
  );

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((v) => !v);
  }, []);

  return (
    <YStack>
      {/* Row */}
      <XStack
        gap="$2"
        paddingVertical="$2.5"
        paddingRight="$3"
        paddingLeft={depth === 0 ? '$3' : undefined}
        // @ts-ignore — web left padding via style for pixel-perfect indent
        style={depth > 0 ? { paddingLeft: depth * INDENT_PX + 12 } : undefined}
        borderBottomWidth={1}
        borderBottomColor="$color3"
        alignItems="flex-start"
        // @ts-ignore – web-only event
        onContextMenu={handleContextMenu}
      >
        {/* Expand/collapse chevron — takes up space even when absent for alignment */}
        <YStack
          width={16}
          height={20}
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
        >
          {hasChildren ? (
            <YStack
              cursor="pointer"
              // @ts-ignore
              onPress={toggleExpanded}
              padding={2}
            >
              <Feather
                name={expanded ? 'chevron-down' : 'chevron-right'}
                size={13}
                color="#888"
              />
            </YStack>
          ) : (
            // Leaf-level connector dot
            depth > 0 ? (
              <YStack
                width={4}
                height={4}
                borderRadius={2}
                backgroundColor="$color6"
              />
            ) : null
          )}
        </YStack>

        {/* Checkbox */}
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          size={depth === 0 ? '$4' : '$3'}
          borderColor="$color6"
          backgroundColor={task.completed ? '$accent7' : 'transparent'}
          flexShrink={0}
        >
          <Checkbox.Indicator>
            <Feather name="check" size={depth === 0 ? 14 : 11} color="#fff" />
          </Checkbox.Indicator>
        </Checkbox>

        {/* Title + description */}
        <YStack
          flex={1}
          gap="$0.5"
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
          onPress={() => router.push(`/task/${task.id}`)}
        >
          <Text
            fontSize={depth === 0 ? '$3' : '$2'}
            fontWeight={depth === 0 ? '700' : '600'}
            color="$color12"
            textDecorationLine={task.completed ? 'line-through' : 'none'}
            opacity={task.completed ? 0.45 : 1}
          >
            {task.title}
          </Text>
          {task.description && depth === 0 ? (
            <Text
              fontSize="$2"
              color="$color8"
              numberOfLines={2}
              opacity={task.completed ? 0.35 : 0.65}
            >
              {task.description}
            </Text>
          ) : null}
        </YStack>
      </XStack>

      {/* Children — rendered recursively when expanded */}
      {hasChildren && expanded && (
        <YStack>
          {task.subtasks!.map((child) => (
            <TaskTreeItem
              key={child.id}
              task={child}
              depth={depth + 1}
              onToggle={onToggle}
              onContextMenu={onContextMenu}
              router={router}
            />
          ))}
        </YStack>
      )}
    </YStack>
  );
}

// ─── Public TaskItem export (kept for barrel compatibility) ───────────────────

interface TaskItemProps {
  task: TaskDto;
  onToggle: (id: string) => void;
  onPress: () => void;
  onContextMenu: (task: TaskDto, x: number, y: number) => void;
}

export function TaskItem({ task, onToggle, onPress, onContextMenu }: TaskItemProps) {
  const router = useRouter();
  return (
    <TaskTreeItem
      task={task}
      depth={0}
      onToggle={onToggle}
      onContextMenu={onContextMenu}
      router={router}
    />
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface TaskListPanelProps {
  tasks: TaskDto[];
  onToggleTask: (id: string) => void;
  /** Called when "Add Subtask" is selected from the context menu */
  onAddSubtask: (task: TaskDto) => void;
}

/** Scrollable list of tasks rendered as an infinitely-recursive tree.
 *  Right-clicking any row opens a context menu with Toggle and Add Subtask options. */
export function TaskListPanel({ tasks, onToggleTask, onAddSubtask }: TaskListPanelProps) {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const activeCount = countActiveTasks(tasks);

  const handleContextMenu = useCallback(
    (task: TaskDto, x: number, y: number) => {
      setContextMenu({ task, x, y });
    },
    [],
  );

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  return (
    <YStack flex={1}>
      {/* Header row */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$3"
        paddingVertical="$3"
      >
        <Text fontSize="$2" fontWeight="700" color="$color10" letterSpacing={1.5}>
          ACTIVE TASKS
        </Text>
        <XStack
          backgroundColor="$color4"
          borderRadius="$2"
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text fontSize="$2" fontWeight="700" color="$color11">
            {String(activeCount).padStart(2, '0')}
          </Text>
        </XStack>
      </XStack>

      {/* Recursive task tree */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <TaskTreeItem
            key={task.id}
            task={task}
            depth={0}
            onToggle={onToggleTask}
            onContextMenu={handleContextMenu}
            router={router}
          />
        ))}
      </ScrollView>

      {/* Right-click context menu */}
      {contextMenu && (
        <TaskContextMenu
          menu={contextMenu}
          onToggle={onToggleTask}
          onAddSubtask={onAddSubtask}
          onClose={closeContextMenu}
        />
      )}
    </YStack>
  );
}
