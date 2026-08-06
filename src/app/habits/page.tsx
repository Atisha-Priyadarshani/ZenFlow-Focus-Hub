import { HabitTracker } from '@/components/HabitTracker';

export const metadata = {
  title: 'Daily Habits & Streaks | ZenFlow Capstone',
  description: 'Track daily study habits and flame streaks in ZenFlow Next.js Capstone',
};

export default function HabitsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Daily Habits &amp; Streaks</h1>
        <p className="text-xs text-[var(--text-muted)]">Build consistency every single day</p>
      </div>
      <HabitTracker />
    </div>
  );
}
