'use client'
import { createContext, useContext, ReactNode, useState } from 'react';
import { Option } from '@/components/Input/interfaceInput'
import axios from 'axios';
import router from '@/api/rotas';
import { useAuth } from './authContext';
import toast from 'react-hot-toast';

type CompanyData = {
  company_id: number
  name: string
}

type ClassifData = {
  classification_id: number
  name: string
}

type StatusData = {
  status_id: number
  name: string
}

type ShirtTypeData = {
  shirt_type_id: number
  name: string
}

function processData<T>(data: T[], getId: (item: T) => number, getValue: (item: T) => string): Option[] {
  const newData: Option[] = data.map((dataItem) => ({
    id: getId(dataItem),
    valor: getValue(dataItem),
  }));

  return newData;
}

type ServerDataContextType = {
  getCompanies: () => Promise<Option[] | null>;
  getClassifications: () => Promise<Option[] | null>;
  getStatus: () => Promise<Option[] | null>;
  getShirtTypes: () => Promise<Option[] | null>;
  parseOptionName: (options: Option[], targetId: number) => string | null;
};

const ServerDataContext = createContext<ServerDataContextType | undefined>(undefined);

type ServerDataProviderProps = {
  children: ReactNode;
};

export const ServerDataProvider: React.FC<ServerDataProviderProps> = ({ children }) => {
  const { getToken } = useAuth();

  async function getClassifications(): Promise<Option[] | null> {
    const labelStorage = 'classifications';
    const classifList = sessionStorage.getItem(labelStorage);
  
    if (classifList) {
      const classifs: Option[] = JSON.parse(classifList);
      return classifs;
    } else {
      // requisição
      try{
        const response = await axios.get(router.classifications, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        })

        if (response.data.errors) {
          toast.error(response.data.errors);
        } else {
          const newData = processData(response.data.data, (item : ClassifData) => item.classification_id, (item) => item.name);
          sessionStorage.setItem(labelStorage, JSON.stringify(newData))
          return newData;
        }
      } catch (error) {
        toast.error('Ocorreu algum erro. Atualize a página');
      }
    }
    return null;
  }

  async function getCompanies(): Promise<Option[] | null> {
    const labelStorage = 'companies';
    const companiesList = sessionStorage.getItem(labelStorage);
  
    if (companiesList) {
      const companies: Option[] = JSON.parse(companiesList);
      return companies;
    } else {
      // requisição
      try{
        const response = await axios.get(router.companies, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        })

        if (response.data.errors) {
          toast.error(response.data.errors);
        } else {
          const newData = processData(response.data.data, (item : CompanyData) => item.company_id, (item) => item.name);
          sessionStorage.setItem(labelStorage, JSON.stringify(newData))
          return newData;
        }
      } catch (error) {
        toast.error('Ocorreu algum erro. Atualize a página');
      }
    }
    
    return null;
  }

  async function getStatus(): Promise<Option[] | null> {
    const labelStorage = 'status'
    const statusList = sessionStorage.getItem(labelStorage);
  
    if (statusList) {
      const status: Option[] = JSON.parse(statusList);
      return status;
    } else {
      // requisição
      try{
        const response = await axios.get(router.statuses, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        })

        if (response.data.errors) {
          toast.error(response.data.errors);
        } else {
          const newData = processData(response.data.data, (item : StatusData) => item.status_id, (item) => item.name);
          sessionStorage.setItem(labelStorage, JSON.stringify(newData))
          return newData;
        }
      } catch (error) {
        toast.error('Ocorreu algum erro. Atualize a página');
      }
    }
    
    return null;
  }

  async function getShirtTypes(): Promise<Option[] | null> {
    const labelStorage = 'shirt-types'
    const dataList = sessionStorage.getItem(labelStorage);
  
    if (dataList) {
      const datas: Option[] = JSON.parse(dataList);
      return datas;
    } else {
      // requisição
      try{
        const response = await axios.get(router.shirtTypes, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        })

        if (response.data.errors) {
          toast.error(response.data.errors);
        } else {
          const newData = processData(response.data.data, (item : ShirtTypeData) => item.shirt_type_id, (item) => item.name);
          sessionStorage.setItem(labelStorage, JSON.stringify(newData))
          return newData;
        }
      } catch (error) {
        toast.error('Ocorreu algum erro. Atualize a página');
      }
    }
    return null;
  }

  function parseOptionName(options: Option[], targetId: number): string | null {
    const foundOption = options.find((option) => option.id == targetId);
    return foundOption ? foundOption.valor : null;
  }

  const contextValue: ServerDataContextType = {
    getCompanies,
    getClassifications,
    getStatus,
    getShirtTypes,
    parseOptionName
  };
  
  return (
    <ServerDataContext.Provider value={contextValue}>{children}</ServerDataContext.Provider>
  );
  
};

export const useServerDataContext = () => {
  const context = useContext(ServerDataContext);
  if (!context) {
    throw new Error('useServerDataContext must be used within an ServerDataProvider');
  }
  return context;
};
