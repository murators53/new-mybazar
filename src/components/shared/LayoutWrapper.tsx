export default function LayoutWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${className}  ease-in-out min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-500 `}
    >
      {children}
    </div>
  );
}
