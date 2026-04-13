import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface Image {
  url: string;
  public_id: string;
  name: string;
  size: number;
  uploadedAt: string;
  eventId: string;
  eventTitle: string;
}

interface ImagesTableProps {
  images: Image[];
  onDeleteImage: (eventId: string, image: any) => void;
}

export function ImagesTable({ images, onDeleteImage }: ImagesTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Preview</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Event</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Uploaded</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {images.map((image, index) => (
              <motion.tr 
                key={`${image.eventId}-${image.public_id || index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium max-w-[200px] truncate">
                  {image.name || 'Unnamed'}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {image.eventTitle}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2 h-[81px]">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    title="View Image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onDeleteImage(image.eventId, image)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                  No images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
