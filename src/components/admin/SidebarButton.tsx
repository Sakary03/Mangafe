/* eslint-disable ts/consistent-type-imports */
'use client';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SidebarButtonProps {
  icon: LucideIcon;
  text: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarButton = ({
  icon: Icon,
  text,
  href,
  isActive = false,
  onClick,
}: SidebarButtonProps) => {
  return (
    <Link
      href={href || '#'}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive
      ? 'bg-blue-100 text-blue-700'
      : 'text-gray-600 hover:bg-gray-100'
    }
      `}
    >
      <Icon size={20} className={isActive ? 'text-blue-700' : 'text-gray-500'} />
      <span className="font-medium">{text}</span>
    </Link>
  );
};

export default SidebarButton;
