import React, { SetStateAction, useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AppRoutes } from '../../../routes';

import { photo64ModelFromUrl } from '../../../models/Photo64Model';
import { ApartmentModel } from '../../../models/ApartmentModel';
import { RoomModel } from '../../../models/RoomModel';

import { fetchAllCountries } from '../../../api/CountriesApi';
import { deleteApartment } from '../../../api/ApartmentsApi.ts';

import { usePermission } from '../../../hooks/usePermission.ts';

import { MultipleImageUpload } from '../../image/upload/MultipleImageUpload';
import { SingleImageUpload } from '../../image/upload/SingleImageUpload';
import { ConfirmationModal } from '../../modal/ConfirmationModal';
import { ActionArticle } from '../../action';
import { SelectField } from '../../input/fields/SelectField.tsx';
import { FieldGroup } from '../../input/fields/FieldGroup.tsx';
import { TextButton } from '../../input/buttons/TextButton';
import { TextField } from '../../input/fields/TextField.tsx';
import { EntryList } from '../../list';
import { RoomModal } from './RoomModal';
import { Icon } from '../../icon';

const emptyRoom: RoomModel = {
  name: '',
  capacity: 1,
  apartment: '',
  bookings: [],
  photos: []
};

interface ApartmentFormProps {
  apartment: ApartmentModel
  confirmedApartmentName: string
  setApartment: React.Dispatch<SetStateAction<ApartmentModel>>
  handleSubmit: React.FormEventHandler<HTMLFormElement>
  submitButtonText: string
  isCreation?: boolean
}

interface OptionType {
  value: string
  label: string
}

export const ApartmentForm: React.FC<ApartmentFormProps> = ({
  apartment,
  confirmedApartmentName,
  setApartment,
  handleSubmit,
  submitButtonText,
  isCreation
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [editModalRoomData, setEditModalRoomData] = useState<
    RoomModel | undefined
  >(undefined);
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});
  const [roomModalIndex, setModalRoomIndex] = useState<number>(-1);
  const [confirmationModalHeading, setConfirmationModalHeading] = useState<string>('');
  const [confirmationModalText, setConfirmationModalText] = useState<string>('');
  const queryClient = useQueryClient();
  const userCanEdit = usePermission('EDITOR', 'ADMIN');

  const { data: countries } = useSuspenseQuery<OptionType[], Error>({
    queryKey: ['countries'],
    queryFn: fetchAllCountries
  });

  const navigate = useNavigate();

  const setApartmentFieldValue = <T extends keyof ApartmentModel>(
    field: T,
    value: ApartmentModel[T]
  ) => {
    setApartment((prevApartment) => {
      return { ...prevApartment, [field]: value };
    });
  };

  const updateSinglePhoto = (newPhoto: string) => {
    setApartment((prevApartment) => {
      const newPhotos = [photo64ModelFromUrl(newPhoto), ...prevApartment.photos64.slice(1)];
      return { ...prevApartment, photos64: newPhotos };
    });
  };

  const updateRoom = (roomToUpdate: RoomModel, index: number) => {
    const updatedRooms = apartment.rooms.slice(0, index);
    updatedRooms.push(
      roomToUpdate,
      ...apartment.rooms.slice(index + 1, apartment.rooms.length)
    );
    setApartmentFieldValue('rooms', updatedRooms);
    toast.success('Room updated successfully!');
  };

  const deleteRoom = (roomIndex: number) => {
    const rooms = apartment.rooms.slice(0, roomIndex);
    rooms.push(...apartment.rooms.slice(roomIndex + 1, apartment.rooms.length));

    setApartmentFieldValue('rooms', rooms);
  };

  const deleteApartmentMutation = useMutation({
    mutationFn: () => {
      return deleteApartment(apartment.id || '');
    },
    onSuccess: () => {
      toast.success('Appartment deleted successfully');
      queryClient.invalidateQueries({ queryKey: [apartment.id, AppRoutes.APARTMENTS], refetchType: 'all' });
      navigate(AppRoutes.APARTMENTS);
    }
  });

  const deleteApartmentClicked = () => {
    setConfirmationModalHeading('Delete apartment');
    setConfirmationModalText('Are you sure you want to delete this apartment?');
    setIsConfirmationOpen(true);
    setActionToConfirm(() => () => {
      deleteApartmentMutation.mutate();
      setIsConfirmationOpen(false);
    });
  };

  const openEditModal = (room: RoomModel, index: number) => {
    setModalRoomIndex(index);
    setEditModalRoomData(room);
    setEditModalOpen(true);
  };

  const addRoom = () => {
    setCreateModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  const seteApartmentPhotosFromUrls = (urls: string[]) => {
    const photoModels = urls.map(url => photo64ModelFromUrl(url));
    setApartmentFieldValue('photos64', photoModels);
  };

  return (
    <ActionArticle significance={100} emphasis={100} className="max-w-[66rem]">
      <div className="relative w-[80.5%] mx-auto my-[0.7rem]">
        <h3 className="text-base leading-8 text-gray-500">
          Apartments
          <span className="mx-[0.4rem]">
            {` / `}
          </span>
          <span className="text-black">{confirmedApartmentName}</span>
        </h3>
      </div>
      <ActionArticle.Heading className="block w-[80.5%] mx-auto my-16">{confirmedApartmentName}</ActionArticle.Heading>

      <form
        onSubmit={handleSubmit}
        className="text-left bg-white text-black text-xl rounded-lg relative mx-auto my-8"
      >
        <SingleImageUpload
          disabled={!userCanEdit}
          sideButton
          gradient
          setImage={image => updateSinglePhoto(image)}
          className="h-[17rem]"
          imageUrl={apartment.photos64[0]?.photo64}
        />
        <div className="container w-[84.5%] relative mx-auto -mt-16 px-12 py-10  bg-white rounded-xl">
          <FieldGroup heading="details">
            <TextField
              required
              readOnly={!userCanEdit}
              placeholder="Party house"
              label="Apartment name"
              value={apartment.name}
              onChange={e => setApartmentFieldValue('name', e.target.value)}
              className="mb-1"
            />
            <TextField
              readOnly={!userCanEdit}
              placeholder="Enter details about apartment that might be relevant for visitors. For example, nearest metro station or quickets route to an office."
              label="Description (optional)"
              value={apartment.description}
              onChange={e =>
                setApartmentFieldValue('description', e.target.value)}
              textArea
            />
          </FieldGroup>
          <FieldGroup heading="location">
            <TextField
              required
              readOnly={!userCanEdit}
              placeholder="Laisves st. 5"
              label="Address"
              value={apartment.address}
              onChange={e => setApartmentFieldValue('address', e.target.value)}
            />
            <div className="flex flex-col lg:flex-row gap-x-1 justify-between">
              <div className="container flex flex-col lg:max-w-[45%]">
                <TextField
                  required
                  readOnly={!userCanEdit}
                  placeholder="Vilnius"
                  label="City"
                  value={apartment.city}
                  onChange={e => setApartmentFieldValue('city', e.target.value)}
                />

                <div className="my-1 flex flex-col">
                  <SelectField
                    required
                    disabled={!userCanEdit}
                    placeholder="Select"
                    label="Country"
                    value={apartment.country}
                    options={countries}
                    onChange={e =>
                      setApartmentFieldValue('country', e.target.value)}
                    className="rounded-lg text-lg leading-4 pl-[0.7rem] py-[0.7rem] w-full border border-gray-300"
                  />
                </div>

              </div>
              <TextField
                required
                readOnly={!userCanEdit}
                placeholder="632514"
                label="Zip code"
                value={apartment.postalCode}
                onChange={e =>
                  setApartmentFieldValue('postalCode', e.target.value)}
                className="w-full ml-0 lg:ml-4 mt-3 lg:mt-0"
              />
            </div>
          </FieldGroup>
          <FieldGroup heading={`Media (${apartment.photos64.length})`}>
            <MultipleImageUpload
              disabled={!userCanEdit}
              urls={apartment.photos64.map(photo => photo.photo64)}
              setUrls={seteApartmentPhotosFromUrls}
              className="h-72"
            />
          </FieldGroup>
          <FieldGroup heading={`rooms (${apartment.rooms.length})`}>
            <EntryList significance={100} emphasis={100}>
              {apartment.rooms.map((room, key) => (
                <EntryList.Entry key={key} className="flex justify-between items-center">
                  <div className="flex">
                    <Icon
                      type="door"
                      className={`size-14 p-4 rounded-lg ${
                      key % 2 !== 0
                        ? 'bg-purple-100 fill-purple-200'
                        : 'bg-blue-100 fill-blue-400'
                      } rounded-full`}
                    />
                    <div className="mx-6">
                      <p className="leading-8 text-xl">{room.name}</p>
                      <p className="leading-6 text-lg text-gray-500">{`${room.capacity} ${room.capacity == 1 ? 'guest' : 'guests'}`}</p>
                    </div>
                  </div>
                  <div>
                    { userCanEdit && (
                      <TextButton
                        type="button"
                        name="Delete"
                        significance={100}
                        emphasis={200}

                        onClick={() => {
                          setIsConfirmationOpen(true);
                          setConfirmationModalHeading('Delete room');
                          setConfirmationModalText(`Are you sure you want to delete room ${room.name}?`);
                          setActionToConfirm(() => () => {
                            deleteRoom(key);
                            setIsConfirmationOpen(false);
                            toast.success('Room removed successfully');
                          });
                        }}
                      />
                    )}
                    <TextButton
                      type="button"
                      name={userCanEdit ? 'Edit' : 'View'}
                      significance={200}
                      emphasis={200}

                      onClick={() => openEditModal(room, key)}
                    />
                  </div>
                </EntryList.Entry>
              ))}
              {userCanEdit && <EntryList.Entry.Icon.Button type="button" icon="plus" onClick={addRoom} />}
            </EntryList>
          </FieldGroup>
          <div className="pb-6 mb-6">
            <div className="flex flex-row justify-end py-2">
              <TextButton
                type="button"
                name={userCanEdit ? 'Cancel' : 'Return to list'}
                significance={userCanEdit ? 200 : 400}
                emphasis={userCanEdit ? 200 : 400}
                onClick={() => navigate(AppRoutes.APARTMENTS)}
              />
              {
              userCanEdit && !isCreation && <TextButton type="button" name="Remove apartment" significance={200} emphasis={200} onClick={deleteApartmentClicked} className="ml-2" />
            }
              { userCanEdit && (
                <>
                  <TextButton
                    name={submitButtonText}
                    significance={400}
                    emphasis={400}
                    className="ml-2"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <RoomModal
          readOnly={!userCanEdit}
          overlay
          disableScroll
          isOpen={Boolean((editModalOpen && editModalRoomData) || createModalOpen)}
          submitText={editModalOpen ? 'Update room' : 'Create room'}
          room={
            editModalOpen && editModalRoomData ? editModalRoomData : emptyRoom
          }
          closeModal={() => {
            setEditModalOpen(false);
            setCreateModalOpen(false);
          }}
          setRoom={(room: RoomModel) =>
            editModalOpen
              ? updateRoom(room, roomModalIndex)
              : toast.success('Room created successfully')
              && setApartmentFieldValue('rooms', [...apartment.rooms, room])}
        />
        <ConfirmationModal
          heading={confirmationModalHeading}
          text={confirmationModalText}
          isOpen={isConfirmationOpen}
          overlay
          disableScroll
          closeModal={closeConfirmationModal}
          onConfirm={actionToConfirm}
        />
      </form>
    </ActionArticle>
  );
};
