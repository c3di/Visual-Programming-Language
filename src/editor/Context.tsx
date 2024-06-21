/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createContext, useContext } from 'react';
import { type ISceneState } from './hooks';
import { widgetFactory, type WidgetFactory } from './widgets';


export const WidgetFactoryContext = createContext<WidgetFactory>(widgetFactory);

export const WidgetFactoryProvider = ({ children }: { children: any }) => {
  return (
    <WidgetFactoryContext.Provider value={widgetFactory}>
      {children}
    </WidgetFactoryContext.Provider>
  );
};
WidgetFactoryProvider.displayName = 'Widget Factory Provider';

export const useWidgetFactory = () => {
  return useContext(WidgetFactoryContext);
};

export const SceneStateContext = createContext<ISceneState | null>(null);

export const useSceneState = () => {
  return useContext(SceneStateContext);
};

export const CodeContext = createContext(undefined);

export const CodeProvider = ({ children, value }) => {
  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  );
};