import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Photo {
  id: string;
  url: string;
  name: string;
}

interface ImageGridProps {
  photos: Photo[];
}

export function ImageGrid({ photos }: ImageGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleDownload = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = photo.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <motion.div 
            key={photo.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5) }}
            className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer bg-slate-800"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img 
              src={photo.url} 
              alt={photo.name} 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
              <button
                onClick={(e) => handleDownload(photo, e)}
                className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                title="Download photo"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedPhoto.url} 
              alt={selectedPhoto.name} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
            >
              <button
                onClick={(e) => handleDownload(selectedPhoto, e)}
                className="bg-white/90 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download High-Res
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
