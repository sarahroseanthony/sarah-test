export interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in-progress' | 'done'
  assignee_id: string | null
  created_at: string
  updated_at: string
}

export type TaskStatus = Task['status']

export type NewTask = Pick<Task, 'title' | 'description'>
