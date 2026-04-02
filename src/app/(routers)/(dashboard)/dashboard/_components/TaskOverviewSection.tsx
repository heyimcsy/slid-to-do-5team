import { MyProgress } from './MyProgress';
import { RecentTaskList } from './RecentTaskList';

export function TaskOverviewSection() {
  return (
    <section className="task-overview-section grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
      <RecentTaskList />
      <MyProgress />
    </section>
  );
}
