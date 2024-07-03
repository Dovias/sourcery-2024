import React, { useEffect, useState } from 'react';

import { roomPhotoModelFromUrl } from '../../../models/RoomPhotoModel';
import { RoomModel } from '../../../models/RoomModel';

import { CenteredModal, CenteredModalProps } from '../../modal/CenteredModal';
import { MultipleImageUpload } from '../../image/upload/MultipleImageUpload';
import { TextButton } from '../../input/buttons/TextButton';
import { TextField } from '../../input/fields/TextField.tsx';
import { Icon } from '../../icon/Icon.tsx';

interface RoomModalProps extends CenteredModalProps {
  room: RoomModel
  setRoom: (room: RoomModel) => void
  submitText: string
  closeModal: () => void
  readOnly?: boolean
}

export const RoomModal: React.FC<RoomModalProps> = (props) => {
  const [changedRoom, setChangedRoom] = useState<RoomModel>(props.room);
  const [noNameGiven, setNoNameGiven] = useState(false);
  const [noPhotoGiven, setNoPhotoGiven] = useState(false);

  const updateRoomField = <T extends keyof RoomModel>(fieldName: T, value: RoomModel[T]) => {
    setChangedRoom((currentRoom) => {
      return { ...currentRoom, [fieldName]: value };
    });
  };

  const exitWithSave = () => {
    if (!changedRoom.name) {
      setNoNameGiven(true);
      return;
    }
    else if (!changedRoom.photos || !changedRoom.photos[0] || !changedRoom.photos[0].photoBase64) {
      setNoPhotoGiven(true);
      return;
    }
    props.setRoom(changedRoom);
    props.closeModal();
  };
  useEffect(() => {
    setChangedRoom(props.room);
    setNoNameGiven(false);
    setNoPhotoGiven(false);
  }, [props]);

  return (
    <CenteredModal {...props} className="w-3/5 max-w-[1000px]">
      <div className="flex flex-row justify-between items-center px-4">
        <h2 className="mb-1 text-xl leading-8">{props.submitText}</h2>
        <button type="button" onClick={props.closeModal}>
          <Icon type="cross" className="size-6 transition hover:scale-125 active:scale-100" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 pb-32 pt-4 border-y border-gray-300">
        <div className="h-60">
          <label
            className="text-sm text-gray-500 block mb-1"
          >
            Image
          </label>
          {noPhotoGiven ? <div className="text-yellow-200 text-sm">photo required</div> : undefined}
          <MultipleImageUpload
            disabled={props.readOnly}
            urls={changedRoom.photos.map(photo => photo.photoBase64)}
            setUrls={urls => updateRoomField('photos', urls.map(url => roomPhotoModelFromUrl(url)))}
            className="h-48 rounded-lg"
          />
        </div>
        <div className="w-full px-4">
          {noNameGiven ? <div className="text-yellow-200 text-sm">Name required</div> : undefined}
          <TextField
            readOnly={props.readOnly}
            label="Room name"
            value={changedRoom.name}
            onChange={e => updateRoomField('name', e.target.value)}
          />
          <div>
            <label
              htmlFor="apartment__country"
              className="text-sm text-gray-500 block mb-1"
            >
              Capacity
            </label>
            <select
              disabled={props.readOnly}
              value={changedRoom.capacity}
              onChange={e => updateRoomField('capacity', Number.parseInt(e.target.value))}
              className="rounded-lg w-2/4 text-lg py-2 pl-1 border border-gray-300"
            >
              <option value={1}>1 guest</option>
              <option value={2}>2 guests</option>
              <option value={3}>3 guests</option>
              <option value={4}>4 guests</option>
              <option value={5}>5 guests</option>
              <option value={6}>6 guests</option>
            </select>
          </div>
        </div>
      </div>
      {
        !props.readOnly && (
          <div className="flex flex-row justify-end items-center p-4 pb-0">
            <TextButton
              onClick={props.closeModal}
              type="button"
              name="Cancel"
              significance={200}
              emphasis={200}
              className="mr-2"
            />
            <TextButton
              onClick={exitWithSave}
              type="button"
              name={props.submitText}
              significance={400}
              emphasis={200}
            />
          </div>
        )
      }
    </CenteredModal>
  );
};
