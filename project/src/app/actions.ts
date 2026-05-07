'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { Task, TaskStatus, NewTask } from '@/types/task'

export async function getTasks(): Promise<Task[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`)
  }

  return (data as Task[]) ?? []
}

export async function createTask(taskData: NewTask): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('tasks').insert({
    title: taskData.title,
    description: taskData.description ?? null,
    status: 'todo',
  })

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`)
  }

  revalidatePath('/')
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update task status: ${error.message}`)
  }

  revalidatePath('/')
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`)
  }

  revalidatePath('/')
}
