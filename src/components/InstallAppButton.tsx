import { useEffect, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Shows an Install button when the browser fires beforeinstallprompt
 * (Chrome/Edge on desktop & Android). iOS uses a short tip instead.
 */
export function InstallAppButton() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosTip, setIosTip] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIos) {
      setIosTip(true);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      deferred.current = null;
      setCanInstall(false);
      setInstalled(true);
      setIosTip(false);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const event = deferred.current;
    if (!event) return;
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted') {
      setCanInstall(false);
      deferred.current = null;
    }
  };

  if (installed) {
    return <span className="install-status">Installed</span>;
  }

  if (canInstall) {
    return (
      <button type="button" className="install-button" onClick={handleInstall}>
        Install app
      </button>
    );
  }

  if (iosTip) {
    return (
      <p className="install-tip" title="Safari → Share → Add to Home Screen">
        Add to Home Screen
      </p>
    );
  }

  return null;
}
