'use client';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SidebarButtonProps {
  icon: LucideIcon;
  text: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

const SidebarButton = ({
  icon: Icon,
  text,
  href,
  isActive = false,
  onClick,
  variant = 'light',
}: SidebarButtonProps) => {
  // Different styling based on the variant (light or dark)
  const styles = {
    light: {
      button: `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }
      `,
      icon: isActive ? 'text-blue-700' : 'text-gray-500',
    },
    dark: {
      button: `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
      `,
      icon: isActive ? 'text-white' : 'text-gray-400',
    },
  };

  return (
    <Link
      href={href || '#'}
      onClick={onClick}
      className={styles[variant].button}
    >
      <Icon size={20} className={styles[variant].icon} />
      <span className="font-medium">{text}</span>
    </Link>
  );
};

export default SidebarButton;
