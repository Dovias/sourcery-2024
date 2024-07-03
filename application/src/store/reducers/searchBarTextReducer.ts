import { createSlice } from '@reduxjs/toolkit';

const searchBarSlice = createSlice({
  name: 'searchBarText',
  initialState: {
    text: ''
  },
  reducers: {
    setText(state, action) {
      state.text = action.payload;
    }
  }
});

export default searchBarSlice.reducer;

export const {
  setText
} = searchBarSlice.actions;
