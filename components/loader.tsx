import { cn } from '@/lib/utils';

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300', className)}>
      <svg
        className="h-8 w-8 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <p className="text-sm">Loading...</p>
    </div>
  );
}
