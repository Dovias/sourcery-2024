import React, { ReactNode, useEffect } from 'react';
import { StyleData, compileStyle } from '../../utilities/style';

export interface ModalProps {
  isOpen: boolean
  children?: ReactNode | ReactNode[]
  className?: StyleData
  closeModal?: () => void
}

export const Modal: React.FC<ModalProps> = ({ isOpen, children, closeModal, className }) => {
  const closeOnEscape = (e: KeyboardEvent) => {
    if (closeModal && e.key == 'Escape') {
      closeModal();
    }
  };
  useEffect(() => {
    closeModal && document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);
  return (
    <div className={compileStyle('z-50 rounded-lg p-2 bg-white shadow-lg', isOpen ? undefined : 'hidden', className)}>
      {children}
    </div>
  );
};
