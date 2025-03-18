import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';
// import { Provider } from 'react-redux';

const targetNode = document.body;
const config: MutationObserverInit  = { childList: true, subtree: true };

let root: Root | null = null;

const callback: MutationCallback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
          const element = document.querySelector(".t-main__wrapper");

          if (element) {
            observer.disconnect();
            if (!root) {
              root = createRoot(element);
            }

            root.render(
              <React.StrictMode>
                {/* <Provider store={store} > */}
                  <App />
                {/* </Provider> */}
              </React.StrictMode>
            );
          }
      }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
