'use client';

import Link from 'next/link';
import { Home, LayoutDashboard, FilePlus } from 'lucide-react';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Create Page', href: '/dashboard/create', icon: <FilePlus size={20} /> },
  { label: 'All Pages', href: '/dashboard/pages', icon: <Home size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-400 dark:border-gray-800 h-screen p-4">
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-2 rounded-md transition-colors font-medium
              ${pathname === link.href
                ? 'bg-gray-200 dark:bg-gray-800 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
