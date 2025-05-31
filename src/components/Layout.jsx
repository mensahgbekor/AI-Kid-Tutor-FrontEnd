// src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from './SideBarLayout';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarLayout />
      <main className="flex-grow bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
