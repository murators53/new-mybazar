import clsx from "clsx";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse transition-colors duration-500 bg-gray-200 dark:bg-zinc-700 rounded-md",
        className
      )}
    ></div>
  );
}
