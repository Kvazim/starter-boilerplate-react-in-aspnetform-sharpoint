import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import { store } from './shared/lib/redux';
import { userStore } from './entities/user/model/user.store';

import './fonts.css';
import './index.css';

const MAX_ATTEMPTS = 50; // Максимальное количество попыток
const RETRY_DELAY = 100; // Задержка между попытками в мс

let root: Root | null = null;
let attempts = 0;

store.dispatch(userStore.actions.initializeUser());

const getContainer = async () => {
  const container = document.getElementById('root')! as HTMLElement;

  if (container) {
    root = createRoot(container);

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          {/* <ToastContainer transition={Zoom} autoClose={CLOSE_TIME} /> */}
          <App />
        </Provider>
      </React.StrictMode>
    );

    return;
  }

  attempts++;

  if (attempts >= MAX_ATTEMPTS) {
    console.error('Не удалось найти контейнер .root после', MAX_ATTEMPTS, 'попыток');
  }

  setTimeout(getContainer, RETRY_DELAY);
};

getContainer();
