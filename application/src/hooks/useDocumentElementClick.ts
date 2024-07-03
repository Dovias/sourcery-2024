import React, { useCallback, useEffect } from 'react';

export type DocumentElementClickHandler = (focused: boolean) => void;

export function useDocumentElementClick(element: React.RefObject<HTMLElement>, handler: DocumentElementClickHandler) {
  const handleMouseDown = useCallback(
    (event: MouseEvent) => handler(element.current?.contains(event.target as HTMLElement) || false),
    [element, handler]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseDown]);
}
