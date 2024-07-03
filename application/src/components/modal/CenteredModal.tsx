import React, { useEffect } from 'react';

import { compileStyle } from '../../utilities/style.ts';

import { Modal, ModalProps } from './Modal';

export interface CenteredModalProps extends ModalProps {
  overlay?: boolean
  disableScroll?: boolean
}

export const CenteredModal: React.FC<CenteredModalProps> = (props) => {
  useEffect(() => {
    document.documentElement.style.overflowY = props.isOpen && props.disableScroll ? 'hidden' : 'auto';
  }, [props.isOpen]);

  return (
    <div className={compileStyle('fixed flex justify-center z-50 items-center w-full h-full left-0 top-0', props.isOpen ? undefined : 'hidden', props.overlay ? 'bg-black/25' : undefined)}>
      <Modal {...props}>
        {props.children}
      </Modal>
    </div>
  );
};
