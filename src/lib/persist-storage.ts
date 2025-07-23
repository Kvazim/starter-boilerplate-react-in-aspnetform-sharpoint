export const persistStorage = {
  getItem: (key: string) => {
    const token = localStorage.getItem(key);
    return token ?? '';
  },
  setItemSafe: (key: string, element: string) => {
    try {
      return localStorage.setItem(key, element);
    } catch (error) {
      return Promise.resolve(null);
    }
  },
  dropItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};
