import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';

interface UploadZoneProps {
  eventId: string;
}

export function UploadZone({ eventId }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    let completed = 0;
    
    for (const file of acceptedFiles) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const storageRef = ref(storage, `events/${eventId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {}, 
            (error) => reject(error), 
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              await addDoc(collection(db, `events/${eventId}/photos`), {
                url: downloadURL,
                name: file.name,
                size: compressedFile.size,
                uploadedAt: serverTimestamp()
              });
              resolve();
            }
          );
        });
        
        completed++;
        setProgress(Math.round((completed / acceptedFiles.length) * 100));
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
      }
    }
    
    setUploading(false);
    setProgress(0);
  }, [eventId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    }
  } as any);

  return (
    <div className="mb-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">
          {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here'}
        </h3>
        <p className="text-slate-400 text-sm">
          or click to select files (JPEG, PNG, WebP)
        </p>
      </div>

      {uploading && (
        <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex justify-between text-sm font-medium text-slate-300 mb-2">
            <span>Uploading photos...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div 
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
