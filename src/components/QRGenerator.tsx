import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRGeneratorProps {
  url: string;
  title: string;
}

export function QRGenerator({ url, title }: QRGeneratorProps) {
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

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-white mb-4">Event QR Code</h3>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-700 mb-4">
        <QRCodeSVG 
          id="qr-code-svg"
          value={url} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="text-sm text-slate-400 mb-4 text-center">
        Guests can scan this code to view and download photos.
      </p>
      <button
        onClick={downloadQR}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download QR Code
      </button>
    </div>
  );
}
