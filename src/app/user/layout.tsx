// src/app/user/layout.tsx
import React from 'react';
import Link from 'next/link';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Topbar */}
      <header className="bg-blue-700 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">User Panel</h1>
          <nav className="space-x-4">
            <Link href="/user/courses" className="hover:underline">
              Courses
            </Link>
            <Link href="/user/my-classes" className="hover:underline">
              My Classes
            </Link>
            <Link href="/" className="hover:underline">
              Logout
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
