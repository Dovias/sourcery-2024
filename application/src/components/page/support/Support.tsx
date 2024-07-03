import React from 'react';
import { AppRoutes } from '../../../routes';
import { Link } from 'react-router-dom';
import { ActionSectionArticle } from '../../action';

export const Support: React.FC = () => {
  return (
    <ActionSectionArticle significance={200} emphasis={100}>
      <h1 className="ml-auto mr-auto font-medium text-2xl mt-4 mb-4">
        Support
      </h1>
      <h2 className="font-medium text-xl mt-2">
        Contact Information
      </h2>
      <p className="ml-2">
        • Email: xxxxxx@xxx.xx
        <br />
        • Phone: +370xxxxxx
      </p>
      <h2 className="font-medium text-xl mt-2">
        FAQ
      </h2>
      <h3 className="font-medium ml-2">
        How do I make a booking?
      </h3>
      <p className="ml-5">Step 1: Log in to your account.</p>
      <p className="ml-5">Step 2: Navigate to the apartments page</p>
      <p className="ml-5">Step 3: Select the desired apartment and click on the apartment you want to book</p>
      <p className="ml-5">Step 4: Follow the prompts to complete your booking.</p>
      <h3 className="font-medium ml-2">
        How do I cancel a booking?
      </h3>
      <p className="ml-5">Step 1: Log in to your account.</p>
      <p className="ml-5">Step 2: Navigate to the bookings page</p>
      <p className="ml-5">Step 3: Select my bookings</p>
      <p className="ml-5">Step 4: Click on a booking you want to cancel</p>
      <p className="ml-5">Step 5: Follow the prompts to cancel your booking.</p>
      <h2 className="font-medium text-xl mt-2">
        Terms of Service
      </h2>
      <p className="ml-5">For details on the terms and conditions governing the use of our app, please click </p>
      <Link className="text-blue-400 ml-5" to={AppRoutes.TERMS_OF_SERVICE}>here</Link>
    </ActionSectionArticle>
  )
  ;
};
