'use client'

import { Task } from '@/lib/supabase'

const STATUS_CYCLE: Record<Task['status'], Task['status']> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
}

const STATUS_LABELS: Record<Task['status'], string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'done': 'Done',
}

const STATUS_COLORS: Record<Task['status'], string> = {
  'todo': 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  'in-progress': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'done': 'bg-green-100 text-green-700 hover:bg-green-200',
}

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (id: string, newStatus: Task['status']) => void
  onDelete: (id: string) => void
}

export default function TaskTable({ tasks, onStatusChange, onDelete }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        No tasks yet. Add one above!
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Assignee
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{task.title}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-500 line-clamp-2">
                  {task.description ?? <span className="italic text-gray-300">—</span>}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onStatusChange(task.id, STATUS_CYCLE[task.status])}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${STATUS_COLORS[task.status]}`}
                  title="Click to advance status"
                >
                  {STATUS_LABELS[task.status]}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {task.assignee_id
                    ? <span className="font-mono text-xs">{task.assignee_id.slice(0, 8)}…</span>
                    : <span className="italic text-gray-300">unassigned</span>}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete task "${task.title}"?`)) {
                      onDelete(task.id)
                    }
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
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
