import React from 'react';

import { TextButton } from '../input/buttons/TextButton';
import { CenteredModal, CenteredModalProps } from './CenteredModal';

interface Props extends CenteredModalProps {
  heading: string
  text: string
  onConfirm: () => void
  closeModal: () => void
}

export const ConfirmationModal: React.FC<Props> = (props) => {
  return (
    <CenteredModal {...props} className="w-1/3">
      <h3 className="mt-2 mb-4 text-xl text-center">{props.heading}</h3>
      <p className="text-center text-lg">{props.text}</p>
      <div className="flex justify-center items-center py-4 mt-4 border-t border-gray-300">
        <TextButton type="button" onClick={props.closeModal} className="mr-10" name="Cancel" significance={300} emphasis={400} />
        <TextButton type="button" onClick={props.onConfirm} name="Ok" significance={400} emphasis={400} />
      </div>
    </CenteredModal>
  );
};
