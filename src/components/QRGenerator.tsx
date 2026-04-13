import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface QRGeneratorProps {
  url: string;
  title: string;
}

export function QRGenerator({ url, title }: QRGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${title.replace(/\s+/g, '_')}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out the photos from ${title}!`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event QR Code</h3>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-4">
        <QRCodeSVG 
          id="qr-code-svg"
          value={url} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 text-center">
        Guests can scan this code to view and download photos.
      </p>
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Link Copied!' : 'Share Link'}
        </button>
      </div>
    </div>
  );
}
