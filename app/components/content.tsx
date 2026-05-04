export function Content({ children }: React.PropsWithChildren) {
  return (
    <div className="h-full p-4">
      <div className="bg-stone-50 dark:bg-neutral-700/20 h-full overflow-hidden rounded-xl shadow-md">
        {children}
      </div>
    </div>
  );
}
