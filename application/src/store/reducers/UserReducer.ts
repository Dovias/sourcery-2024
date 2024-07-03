import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../../models/UserModel';

import defaultProfilePicture from '/images/default-profile.jpg';

const initialState: UserModel = {
  firstName: '',
  lastName: '',
  email: '',
  profileBase64: defaultProfilePicture,
  token: '',
  // A bit dirty but the previous version was hacky also so...
  role: {
    roleId: -1,
    roleName: ''
  },
  jobTitle: '',
  city: '',
  id: '',
  country: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserModel>) {
      const payload = action.payload;
      if (payload) {
        const { id, firstName, lastName, email, token, profileBase64, role, jobTitle, city, country } = action.payload;
        state.firstName = firstName;
        state.lastName = lastName;
        state.email = email;
        state.token = token;
        state.profileBase64 = profileBase64 ? profileBase64 : defaultProfilePicture;
        state.role = role;
        state.jobTitle = jobTitle;
        state.city = city;
        state.country = country;
        state.id = id;
      }
    },

    logOut(state) {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.token = '';
      state.profileBase64 = '';
      state.role = {
        roleId: -1,
        roleName: ''
      },
      state.jobTitle = '';
      state.city = '';
      state.country = '';
      state.id = '';
    }
  }
});

export default userSlice.reducer;

export const {
  setUser,
  logOut
} = userSlice.actions;
