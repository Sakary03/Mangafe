'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      <p>
        ©
        {new Date().getFullYear()}
        {' '}
        Your App. All rights reserved.
      </p>
    </footer>
  );
}
