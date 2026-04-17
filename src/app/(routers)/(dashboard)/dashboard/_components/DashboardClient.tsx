import { DashboardTitle } from './DashboardTitle';
import { TaskOverviewSection } from './TaskOverviewSection';
import { TodosByGoalSection } from './TodosByGoalSection';

export function DashboardClient() {
  return (
    <div className="flex h-full w-86 flex-col pt-8 md:w-full md:max-w-200 md:min-w-159 md:space-y-0 md:pt-0 lg:w-full lg:max-w-328 lg:min-w-200">
      <DashboardTitle />
      <TaskOverviewSection />
      <TodosByGoalSection />
    </div>
  );
}
