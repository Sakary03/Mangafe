'use client';
import type {
  LucideIcon,
} from 'lucide-react';
// Your auth hook
import {
  Heart,
  HelpCircle,
  Home,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarButton from './SidebarButton';

interface NavItem {
  icon: LucideIcon;
  text: string;
  href: string;
}

export default function UserSidebar() {
  const pathname = usePathname();
  // const { logout } = useAuth(); // Your auth hook with logout function

  // User navigation items
  const navItems: NavItem[] = [
  { icon: Home, text: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingBag, text: 'My Orders', href: '/orders' },
    { icon: Heart, text: 'Wishlist', href: '/wishlist' },
    { icon: User, text: 'My Profile', href: '/profile' },
    { icon: Settings, text: 'Settings', href: '/settings' },
    { icon: HelpCircle, text: 'Help & Support', href: '/support' },
  ];

  // Logout handler
  // const handleLogout = () => {
  //   logout();
  // };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo section */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">User Portal</h1>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <SidebarButton
            key={item.href}
            icon={item.icon}
            text={item.text}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Footer section with logout
      <div className="p-4 border-t border-gray-200">
        <SidebarButton
          icon={LogOut}
          text="Logout"
          onClick={handleLogout}
        />
      </div> */}
    </div>
  );
}
