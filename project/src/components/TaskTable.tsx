'use client'

import { useTransition } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import { updateTaskStatus, deleteTask } from '@/app/actions'

interface TaskTableProps {
  tasks: Task[]
}

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  'in-progress': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  done: 'bg-green-100 text-green-700 hover:bg-green-200',
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleStatusClick(task: Task) {
    const nextStatus = STATUS_CYCLE[task.status]
    startTransition(async () => {
      await updateTaskStatus(task.id, nextStatus)
    })
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`Delete task "${task.title}"?`)) return
    startTransition(async () => {
      await deleteTask(task.id)
    })
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No tasks yet. Add one above!
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {task.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {task.description ?? <span className="italic text-gray-400">—</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleStatusClick(task)}
                  disabled={isPending}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${STATUS_COLORS[task.status]}`}
                  title="Click to advance status"
                >
                  {STATUS_LABELS[task.status]}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {task.assignee_id ? (
                  <span className="truncate block max-w-[120px]" title={task.assignee_id}>
                    {task.assignee_id.slice(0, 8)}…
                  </span>
                ) : (
                  <span className="italic text-gray-400">unassigned</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleDelete(task)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
