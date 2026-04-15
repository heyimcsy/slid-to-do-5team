export function GoalsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="goals-container w-full rounded-[1.75rem] bg-white px-4 py-4.5 text-black md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:rounded-[2.5rem] lg:px-8 lg:py-6">
      {children}
    </div>
  );
}
