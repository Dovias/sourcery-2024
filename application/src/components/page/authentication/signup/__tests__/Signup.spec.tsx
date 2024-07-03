import React from 'react';
import { it, expect, describe } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { SignUp } from '../SignUp.tsx';

describe('Signup page', () => {
  it('Create account message exists', async () => {
    const result = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>);

    const welcomeText = result.getByText('Create Your Account', { exact: false });
    expect(welcomeText).toBeTruthy();
  });
});
