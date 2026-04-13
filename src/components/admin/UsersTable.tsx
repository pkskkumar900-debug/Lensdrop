import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: any;
}

interface UsersTableProps {
  users: User[];
  onDeleteUser?: (uid: string) => void;
}

export function UsersTable({ users, onDeleteUser }: UsersTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">UID</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {users.map((user, index) => (
              <motion.tr 
                key={user.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs">
                  {user.uid}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' 
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== 'admin' && onDeleteUser && (
                    <button
                      onClick={() => onDeleteUser(user.uid)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
