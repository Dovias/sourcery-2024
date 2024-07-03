import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from './reducers/UserReducer';
import searchBarTextReducer from './reducers/searchBarTextReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    searchBarText: searchBarTextReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
