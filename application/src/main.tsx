import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { App } from './App';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('app')!).render(
  <GoogleOAuthProvider clientId="1056328422697-fbdnnvn7fmv6nqk8mqgr27crtnql1r91.apps.googleusercontent.com">
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ToastContainer position="bottom-center" autoClose={1000} transition={Slide} limit={3} />
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
