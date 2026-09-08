import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasDismissed) {
      setDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Allow showing again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
      setDismissed(false);
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="bg-white shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Install INPS Portal</h3>
                <p className="text-sm text-slate-500">Get the best experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <p className="text-slate-600 leading-relaxed">
              Install the INPS School Portal on your device for:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Quick access from your home screen</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Faster loading and offline support</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Full-screen app experience</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Push notifications (coming soon)</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 h-auto text-base"
            >
              <Download className="w-5 h-5 mr-2" />
              Install Now
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 py-3 h-auto text-base"
            >
              Not Now
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-400 text-center mt-4">
            Free installation • No data charges
          </p>
        </div>
      </Card>
    </div>
  );
}