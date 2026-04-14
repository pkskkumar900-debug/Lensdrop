import toast from 'react-hot-toast';

export const notify = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#0f172a', // slate-950
        color: '#f8fafc', // slate-50
        border: '1px solid #1e293b', // slate-800
      },
      iconTheme: {
        primary: '#4f46e5', // indigo-600
        secondary: '#ffffff',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
      },
      iconTheme: {
        primary: '#ef4444', // red-500
        secondary: '#ffffff',
      },
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
      },
    });
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};
