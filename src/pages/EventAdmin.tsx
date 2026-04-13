import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { QRGenerator } from '../components/QRGenerator';
import { UploadZone } from '../components/UploadZone';
import { InvitationGenerator } from '../components/InvitationGenerator';
import { ArrowLeft, Trash2, ExternalLink, Image as ImageIcon, MailOpen } from 'lucide-react';
import { motion } from 'motion/react';

export function EventAdmin() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'invite'>('gallery');

  useEffect(() => {
    if (!user || !id) return;

    const docRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.createdBy !== user.uid) {
          navigate('/dashboard');
          return;
        }
        setEvent({ id: docSnap.id, ...data });
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching event:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [id, user, navigate]);

  const handleDeletePhoto = async (photo: any) => {
    if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
    
    try {
      await updateDoc(doc(db, 'events', id!), {
        images: arrayRemove(photo)
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  if (loading || !event) {
    return <div className="text-center py-12 text-gray-500 dark:text-slate-400">Loading event details...</div>;
  }

  const galleryUrl = `${window.location.origin}/event/${id}`;
  const photos = event.images || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words flex-1 min-w-0">{event.title}</h1>
            <a 
              href={galleryUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              View Gallery <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Gallery & Uploads
            </button>
            <button
              onClick={() => setActiveTab('invite')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'invite'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <MailOpen className="w-4 h-4" /> Digital Invitation
            </button>
          </div>

          {activeTab === 'gallery' ? (
            <>
              <UploadZone eventId={id!} />

              <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Uploaded Photos ({photos.length})
                </h2>
                
                {photos.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 border-dashed">
                    <p className="text-gray-500 dark:text-slate-400">No photos uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo: any, index: number) => (
                      <motion.div 
                        key={photo.public_id || index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.name || 'Event photo'} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleDeletePhoto(photo)}
                            className="bg-white dark:bg-slate-900/80 text-red-600 dark:text-red-400 p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 transition-colors backdrop-blur-sm"
                            title="Delete photo"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <InvitationGenerator eventId={id!} eventTitle={event.title} initialData={event.invite} />
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <QRGenerator url={galleryUrl} title={event.title} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
