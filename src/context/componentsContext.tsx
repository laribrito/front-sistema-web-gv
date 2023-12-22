'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Definindo tipos
type ComponentsContextType = {
  isloading: boolean
  setLoading: (state: boolean) => void;
};

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

interface ComponentsProviderProps{
  children: ReactNode;
};

export function ComponentsProvider({ children }:ComponentsProviderProps){
  const [isloading, setLoad] = useState<boolean>(false)

  const setLoading = (state:boolean) => {
    setLoad(state)
  };

  return (
    <ComponentsContext.Provider value={{ isloading, setLoading }}>
      {children}
    </ComponentsContext.Provider>
  );
};

export const useComponentsContext = () => {
  const context = useContext(ComponentsContext);
  if (!context) {
    throw new Error('useComponentsContext must be used within an ComponentsProvider');
  }
  return context;
};
