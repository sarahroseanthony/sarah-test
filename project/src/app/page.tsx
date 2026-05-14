'use client'

import { useEffect, useState } from 'react'
import { supabase, Task } from '@/lib/supabase'
import TaskTable from '@/components/TaskTable'
import AddTaskForm from '@/components/AddTaskForm'

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      setFetchError('Could not load tasks. Check your Supabase configuration.')
    } else {
      setTasks(data as Task[])
      setFetchError(null)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  async function handleAdd(title: string, description: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, description: description || null })
      .select()
      .single()

    if (error) {
      console.error('Error adding task:', error)
      throw error
    }

    setTasks((prev) => [data as Task, ...prev])
  }

  async function handleStatusChange(id: string, newStatus: Task['status']) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating task status:', error)
      return
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tasks — create, update status, and delete.
          </p>
        </header>

        <AddTaskForm onAdd={handleAdd} />

        {fetchError && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
            {fetchError}
          </div>
        )}

        <TaskTable
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
