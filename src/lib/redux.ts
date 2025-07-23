import { combineReducers, configureStore, createListenerMiddleware, Slice, Reducer } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    app: (store = {}) => store,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = (): AppDispatch => {
  return useDispatch();
};

export const createBaseSelector = <S, N extends string>(slice: Slice<S, any, N>) => {
  return (store: unknown) => {
    const anyStore = store as Record<string, unknown>;
    return anyStore[slice.name] as S;
  };
};

export const useAction = <T, A extends Parameters<AppDispatch>[0]>(factory: (p: T) => A) => {
  const dispatch = useAppDispatch();

  return useCallback(
    (params: T) => {
      return dispatch(factory(params));
    },
    [dispatch, factory]
  );
};

export const useActionWithDeps = <T extends { deps: unknown }, A extends Parameters<AppDispatch>[0]>(
  factory: (p: T) => A,
  deps: T['deps']
) => {
  const dispatch = useAppDispatch();

  return useCallback(
    (params: Omit<T, 'deps'>) => {
      return dispatch(factory({ deps, ...params } as T));
    },
    [dispatch, factory, deps]
  );
};

const slicesSet = new Set<Slice>();

export const registerSlice = (slices: Slice[]) => {
  slices.forEach((slice) => {
    slicesSet.add(slice);
  });

  const reducers = Array.from(slicesSet).reduce((acc: Record<string, Reducer>, slice) => {
    acc[slice.name] = slice.reducer;
    return acc;
  }, {});

  store.replaceReducer(combineReducers(reducers) as Reducer);
};
