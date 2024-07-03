import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { AppRoutes } from '../../../routes';

import { fetchAllApartmentsWithSearch } from '../../../api/ApartmentsApi.ts';

import { RootState } from '../../../store/store';
import { ApartmentModel } from '../../../models/ApartmentModel.tsx';

import { ActionSectionArticle } from '../../action';
import { EntryList } from '../../list';
import { Icon } from '../../icon/Icon.tsx';

export function Apartments() {
  const navigate = useNavigate();
  const { text } = useSelector((state: RootState) => state.searchBarText);
  const { data } = useSuspenseQuery<ApartmentModel[]>({
    queryKey: [AppRoutes.APARTMENTS, text],
    queryFn: () => fetchAllApartmentsWithSearch(text)
  });
  const currentUserRole = useSelector((state: RootState) => state.user.role?.roleName.toUpperCase());
  const currentUserCanEdit = currentUserRole === 'ADMIN' || currentUserRole === 'EDITOR';

  const addApartment = () => {
    navigate(AppRoutes.NEW_APARTMENT);
  };

  return (
    <ActionSectionArticle significance={100} emphasis={100}>
      <ActionSectionArticle.Heading>Apartments</ActionSectionArticle.Heading>
      <ActionSectionArticle.Paragraph>View and manage available apartments and their information</ActionSectionArticle.Paragraph>

      <EntryList significance={300} emphasis={200} className="my-8">
        {data.map(({ id, name, address, rooms }) => {
          const guests = rooms.reduce((total, room) => total + room.capacity, 0);

          return (
            <EntryList.Entry key={id} className="flex justify-between items-center">
              <div className="flex flex-[0.5] items-center">
                <Icon type="building" className="flex-shrink-0 size-14 p-4 bg-gray-200 rounded-full" />
                <div className="mx-4">
                  <p className="leading-8 text-xl">{name}</p>
                  <p className="leading-6 text-lg text-gray-500">{address}</p>
                </div>
              </div>
              <div className="flex flex-1 max-w-[32.55rem] items-center">
                <div className="flex flex-1">
                  <div className="flex mx-4 min-w-[9.325rem]">
                    <Icon type="door" className="size-6 mr-3" />
                    <p className="leading-6 text-lg text-nowrap">{`${rooms.length} ${rooms.length == 1 ? 'room' : 'rooms'}`}</p>
                  </div>
                  <div className="flex mx-4">
                    <Icon type="people" className="size-6 mr-3" />
                    <p className="leading-6 text-lg text-nowrap">{`${guests} ${guests == 1 ? 'guest' : 'guests'}`}</p>
                  </div>
                </div>
                <Link to={AppRoutes.APARTMENT.replace(':id', `${id}`)} className="p-2 ml-auto hover:scale-125 active:scale-100 duration-200 transition">
                  <Icon type="tailless-arrow-right" className="size-6" />
                </Link>
              </div>
            </EntryList.Entry>
          );
        })}
        {currentUserCanEdit && <EntryList.Entry.Icon.Button icon="plus" onClick={addApartment} className="my-4" />}
      </EntryList>
    </ActionSectionArticle>
  );
}
