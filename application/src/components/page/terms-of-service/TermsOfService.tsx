import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes } from '../../../routes';
import { ActionSectionArticle } from '../../action';

export const TermsOfService: React.FC = () => {
  return (
    <ActionSectionArticle significance={200} emphasis={100}>
      <h1 className="ml-auto mr-auto font-medium text-2xl mt-4 mb-4">
        Terms of Service
      </h1>
      Please read these Terms of Service (&#34;Terms&#34;, &#34;Terms of Service&#34;) carefully before using the application (the
      &#34;Service&#34;) operated by (&#34;us&#34;, &#34;we&#34;, or &#34;our&#34;).
      <h2 className="font-medium text-xl mt-2">
        1. Acceptance of Terms
      </h2>
      By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the
      terms, then you may not access the Service.
      <h2 className="font-medium text-xl mt-2">
        2. Use of the Service
      </h2>
      You are responsible for your use of the Service and any consequences thereof. You agree not to use the Service
      in any manner that violates any applicable law, regulation, or term of this agreement.
      <h2 className="font-medium text-xl mt-2">
        3. User Accounts
      </h2>
      To access certain features of the Service, you may be required to create an account. When creating an account,
      you must provide accurate and complete information. You are solely responsible for the activity that occurs on
      your account and must keep your account password secure.
      <h2 className="font-medium text-xl mt-2">
        4. Cancellations
      </h2>

      Cancellation policies for bookings are specified at the time of booking.
      <h2 className="font-medium text-xl mt-2">
        5. Content
      </h2>

      Our Service allows you to post, link, store, share, and otherwise make available certain information, text,
      graphics, videos, or other material. You are responsible for the content that you post to the Service, including
      its legality, reliability, and appropriateness.
      <h2 className="font-medium text-xl mt-2">
        6. Termination
      </h2>

      We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
      liability, under our sole discretion, for any reason whatsoever and without limitation, including but not
      limited to a breach of the Terms.
      <h2 className="font-medium text-xl mt-2">
        7. Changes to Terms
      </h2>

      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to
      access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If
      you do not agree to the new terms, please stop using the Service.
      <h2 className="font-medium text-xl mt-2">
        8. Contact Us
      </h2>

      If you have any questions about these Terms, please contact us at

      <Link to={AppRoutes.SUPPORT} className="text-blue-400">Support.</Link>

    </ActionSectionArticle>
  );
};
