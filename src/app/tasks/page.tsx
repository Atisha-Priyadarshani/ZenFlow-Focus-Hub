import { TaskManager } from '@/components/TaskManager';

export const metadata = {
  title: 'Focus Objectives | ZenFlow Capstone',
  description: 'Manage study tasks and learning goals in ZenFlow Next.js Capstone',
};

export default function TasksPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Focus Objectives</h1>
        <p className="text-xs text-[var(--text-muted)]">Organize your daily study objectives &amp; coding tasks</p>
      </div>
      <TaskManager />
    </div>
  );
}
