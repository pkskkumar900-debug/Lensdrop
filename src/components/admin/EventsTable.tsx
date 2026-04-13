import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  createdBy: string;
  images: any[];
  createdAt: any;
}

interface EventsTableProps {
  events: Event[];
  onDeleteEvent: (id: string) => void;
}

export function EventsTable({ events, onDeleteEvent }: EventsTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Event Title</th>
              <th className="px-6 py-4 font-medium">Event ID</th>
              <th className="px-6 py-4 font-medium">Created By (UID)</th>
              <th className="px-6 py-4 font-medium">Images</th>
              <th className="px-6 py-4 font-medium">Created Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {events.map((event, index) => (
              <motion.tr 
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {event.title}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs">
                  {event.id}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs">
                  {event.createdBy}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {event.images?.length || 0}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {event.createdAt?.toDate ? new Date(event.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <Link
                    to={`/upload/${event.id}`}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    title="View Event"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
