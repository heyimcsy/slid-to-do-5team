import { DashboardTitle } from './DashboardTitle';
import { TaskOverviewSection } from './TaskOverviewSection';
import { TodosByGoalSection } from './TodosByGoalSection';

export function DashboardClient() {
  return (
    <div className="flex h-full w-86 flex-col space-y-12 pt-8 pb-14 md:min-w-159 md:space-y-0 md:pt-0 lg:w-265 lg:max-w-328">
      <DashboardTitle />
      <TaskOverviewSection />
      <TodosByGoalSection />
    </div>
  );
}
