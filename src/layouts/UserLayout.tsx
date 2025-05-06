// src/layouts/UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';
import AppHeader from '../components/common/Header';

const UserLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
