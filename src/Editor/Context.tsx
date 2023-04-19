/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createContext, useContext } from 'react';
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