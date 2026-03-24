interface TodoHeaderProps {
  count: number;
}

export default function TodoHeader({ count }: TodoHeaderProps) {
  return (
    <div className="font-2xl-semibold flex gap-2">
      <h1>모든 할 일 </h1>
      <span className="text-orange-600">{count}</span>
    </div>
  );
}
