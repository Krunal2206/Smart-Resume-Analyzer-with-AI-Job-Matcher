import { BadgeCheck, User } from 'lucide-react';
import React from 'react'

interface User {
  name?: string;
  email?: string;
}

const ResumeSummary = ({ user }: { user: User }) => {
  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">
        Welcome, {user?.name || "Guest"}!
      </h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-2">
        <p className="flex items-center gap-2 text-gray-300 flex-wrap">
          <User size={18} className="flex-none" /> <strong>Name:</strong>
          <span className='break-words'>{user?.name}</span>
        </p>
        <p className="flex flex-wrap items-center gap-2 text-gray-300">
          <BadgeCheck size={18} className="flex-none" /> <strong>Email:</strong>
          <span className="break-words">{user?.email}</span>
        </p>
      </div>
    </div>
  );
};

export default ResumeSummary
