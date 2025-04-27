import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';
// import { Provider } from 'react-redux';

const targetNode = document.querySelector(".t-main__wrapper") || document.body;
const config: MutationObserverInit  = { childList: true, subtree: true };
const maxAttempts = 1000;
const attemptInterval = 100;

let root: Root | null = null;
let attempts = 0;
let observer: MutationObserver | null = null;

const callback: MutationCallback = function (mutationsList, obs) {
  for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
          const element = document.querySelector(".t-main__wrapper");

          if (element) {
            obs.disconnect();
            if (!root) {
              root = createRoot(element);
            }

            root.render(
              <React.StrictMode>
                {/* <Provider store={store} > */}
                <h1>jkdflkfjsa;ldfs</h1>
                  <App />
                {/* </Provider> */}
              </React.StrictMode>
            );

            return;
          }
      }
  }

  attempts++;
  if (attempts >= maxAttempts) {
    console.error("Целевой элемент '.t-main__wrapper' не найден после максимального количества попыток.");
    obs.disconnect();
    observer = null;
  }
};

observer = new MutationObserver(callback);
observer.observe(targetNode, config);

setTimeout(() => {
  if (observer) {
      observer.disconnect();
      observer = null;
      console.warn("MutationObserver: время ожидания истекло. Элемент '.t-main__wrapper' не найден.");
  }
}, maxAttempts * attemptInterval + 1000);
