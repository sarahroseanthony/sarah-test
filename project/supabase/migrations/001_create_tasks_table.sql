-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  assignee_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read all tasks
CREATE POLICY "tasks_select_all"
  ON tasks
  FOR SELECT
  USING (true);

-- Policy: anyone can insert tasks
CREATE POLICY "tasks_insert_all"
  ON tasks
  FOR INSERT
  WITH CHECK (true);

-- Policy: only the assignee can update their own tasks
CREATE POLICY "tasks_update_own"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = assignee_id);

-- Policy: only the assignee can delete their own tasks
CREATE POLICY "tasks_delete_own"
  ON tasks
  FOR DELETE
  USING (auth.uid() = assignee_id);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
