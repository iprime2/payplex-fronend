'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './theme-toggle';
import { UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Navbar({ showUser = false }: { showUser?: boolean }) {
  const { email } = useAuth();
  const router = useRouter();

  const logoutBtn = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    toast.success('Logged out successfully');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <nav className="w-full px-6 py-4 shadow-sm border-b border-gray-400 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/dashboard" className="flex items-center gap-1 text-xl font-semibold hover:opacity-80 font-serif">
          <Image src="/logo.png" alt="Logo" width={102} height={102} />
          Payplex
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {showUser && email && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <UserCircle2 size={24} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-sm">{email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutBtn()}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
