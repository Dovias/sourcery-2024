import React from 'react';
import { LocationItem } from './LocationItem';
import { LocationsModel } from '../../../models/LocationsModel';
import { fetchLocations } from '../../../api/LocationsApi.ts';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ActionSectionArticle } from '../../action/article/ActionSectionArticle.tsx';

export const Contacts: React.FC = () => {
  const { data } = useSuspenseQuery<LocationsModel[]>({
    queryKey: ['locations'],
    queryFn: fetchLocations
  });

  return (
    <ActionSectionArticle significance={100} emphasis={100}>
      <ActionSectionArticle.Heading>Contacts</ActionSectionArticle.Heading>
      <ActionSectionArticle.Paragraph>Address and contact details of the apartments</ActionSectionArticle.Paragraph>

      <div className="min-w-[500px] max-w-7xl">
        {data.map(location => (
          <LocationItem key={location.address} location={location} />
        ))}
      </div>
    </ActionSectionArticle>
  );
};
