import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ImageGrid } from '../components/ImageGrid';
import { DigitalInvite } from '../components/DigitalInvite';
import { Download, Camera, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion } from 'motion/react';

export function EventGallery() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const showInvite = searchParams.get('invite') === 'true';
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    if (id === 'demo') {
      setEvent({ 
        id: 'demo', 
        title: 'Sample Wedding Gallery', 
        createdBy: 'demo',
        images: [
          { id: '1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', name: 'wedding_1.jpg' },
          { id: '2', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80', name: 'wedding_2.jpg' },
          { id: '3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', name: 'wedding_3.jpg' },
          { id: '4', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', name: 'wedding_4.jpg' },
          { id: '5', url: 'https://images.unsplash.com/photo-1532712938730-4e36c457b1c5?auto=format&fit=crop&w=800&q=80', name: 'wedding_5.jpg' },
          { id: '6', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80', name: 'wedding_6.jpg' },
        ]
      });
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        setEvent(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching event:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  const photos = event?.images || [];

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      const zip = new JSZip();
      let count = 0;
      
      const fetchPromises = photos.map(async (photo: any) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          zip.file(photo.name || 'photo.jpg', blob);
          count++;
          setDownloadProgress(Math.round((count / photos.length) * 100));
        } catch (err) {
          console.error(`Failed to fetch ${photo.name}`, err);
        }
      });
      
      await Promise.all(fetchPromises);
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${event.title.replace(/\s+/g, '_')}_Photos.zip`);
      
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Failed to download all photos. Please try again or download individually.");
    } finally {
      setDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-slate-400">Loading gallery...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400">This gallery may have been deleted or the link is incorrect.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {(showInvite || event.invite) && event.invite && (
        <DigitalInvite title={event.title} invite={event.invite} />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{event.title} Gallery</h1>
          <p className="text-gray-500 dark:text-slate-400 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </p>
        </motion.div>
        
        {photos.length > 0 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            className="bg-gray-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
          >
            {downloadingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zipping... {downloadProgress}%
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download All (.zip)
              </>
            )}
          </motion.button>
        )}
      </div>

      {photos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm"
        >
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No photos yet</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            The photographer hasn't uploaded any photos to this gallery yet. Check back later!
          </p>
        </motion.div>
      ) : (
        <ImageGrid photos={photos} />
      )}
    </motion.div>
  );
}
