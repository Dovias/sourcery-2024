import { useEffect } from 'react';

export function useBeforeUnload() {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (document.querySelectorAll('input[value=""], textarea:empty').length < 6
      || [...document.querySelectorAll('h2')].find(
        h2 => h2.textContent?.includes('rooms (0)')) == undefined)event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
