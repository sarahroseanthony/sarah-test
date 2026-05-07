import { getTasks } from '@/app/actions'
import TaskTable from '@/components/TaskTable'
import AddTaskForm from '@/components/AddTaskForm'

export default async function HomePage() {
  const tasks = await getTasks()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Task Tracker</h1>
          <p className="mt-2 text-gray-600">
            Manage your tasks — create, update status, and delete.
          </p>
        </header>

        <AddTaskForm />

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            All Tasks{' '}
            <span className="text-sm font-normal text-gray-500">
              ({tasks.length})
            </span>
          </h2>
          <TaskTable tasks={tasks} />
        </section>
      </div>
    </div>
  )
}
