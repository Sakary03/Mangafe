'use client';
import type {
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  BookA,
  BookOpenText,
  Home,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarButton from './SidebarButton';

interface NavItem {
  icon: LucideIcon;
  text: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logoutUser } = useAuth(); // Your auth hook with logout function
  // Navigation items configuration
  const navItems: NavItem[][] = [
    [
      { icon: Home, text: 'Dashboard', href: '/dashboard' },
      { icon: Users, text: 'Users', href: '/dashboard/users' },
    ],
    [
      { icon: BookA, text: 'Manga', href: '/dashboard/manga' },
      { icon: BookOpenText, text: 'Book', href: '/dashboard/book' },
    ],
    [
      { icon: Settings, text: 'Settings', href: '/dashboard/settings' },
    ],
  ];

  // Logout handler
  const handleLogout = async () => {
    await logoutUser();
    console.log('Logging out...');
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo section */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Mangaka</h1>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-3 py-4 space-y-4">
        {navItems.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-1">
            {row.map(item => (
              <SidebarButton
                key={item.href}
                icon={item.icon}
                text={item.text}
                href={item.href}
                isActive={pathname === item.href}
              />
            ))}
            <hr key={`divider-${rowIndex}`} className="border-t border-gray-200 my-2" />
          </div>
        ))}
      </nav>

      {/* Footer section with logout */}
      <div className="p-4 border-t border-gray-200">
        <SidebarButton
          icon={LogOut}
          text="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
