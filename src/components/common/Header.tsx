'use client';
// Your auth hook
import { Bell, HelpCircle, Search, User } from 'lucide-react';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

  return (
    <header className={`
      ${isAdmin ? 'bg-white' : 'bg-white'} 
      border-b 
      ${isAdmin ? 'border-gray-200' : 'border-gray-200'} 
      h-16 flex items-center justify-between px-6
    `}
    >
      {/* Left side */}
      <div className="flex items-center">
        <h1 className={`
          text-lg font-semibold 
          ${isAdmin ? 'text-gray-800' : 'text-gray-800'} 
          md:hidden
        `}
        >
          {isAdmin ? 'Admin Portal' : 'User Portal'}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className={`
              w-full pl-10 pr-4 py-2 rounded-lg 
              border ${isAdmin ? 'border-gray-200' : 'border-gray-200'} 
              focus:outline-none focus:ring-2 
              ${isAdmin ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}
            `}
          />
        </div>
      </div>

      {/* Right side - user menu */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {isAdmin && (
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <HelpCircle size={20} />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isAdmin ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}
          `}
          >
            <User size={18} />
          </div>
          <span className="hidden md:inline font-medium text-sm">
            {user?.name || 'User'}
            {isAdmin && <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Admin</span>}
          </span>
        </div>
      </div>
    </header>
  );
}
