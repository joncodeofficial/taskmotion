import { useEffect, useState } from 'react';

export function useShortcut(scc: string[]) {
  const [shortcut, setShortcut] = useState<string | undefined>();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && (key === 'e' || key === 'l')) {
        const sc = `ctrl+${key}` as 'ctrl+e' | 'ctrl+l';
        e.preventDefault();
        setShortcut(sc);
      } else if (scc.includes(key)) {
        setShortcut(key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [scc]);

  queueMicrotask(() => setShortcut(undefined));
  return shortcut;
}
