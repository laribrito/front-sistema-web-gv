'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

export type OrderInfos = {
  // Defina a estrutura dos detalhes do pedido
  nomePedido: string
  nomeCliente: string
  telefoneCliente: string
  empresa: number
  classificacao: number
  status: number
};

export type ShirtModel = {
  printName: string
  shirtModeling: number
  number_units?: number
  namePhotoModel?: string
};

type OrderContextType = {
  currentOrder: OrderInfos | null;
  setOrderInfos: (order: OrderInfos | null) => void;
  getOrderInfos: () => OrderInfos;

  setShirtModels: (models: ShirtModel[]) => void;
  getShirtModels: () => ShirtModel[];
  getShirtModel: (id: number) => ShirtModel
  getIdModel: (model: ShirtModel) => number

  filesUpload: File[]
  setFilesUpload: (files: File[]) => void;
  getFilesUpload: () => File[];
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderProviderProps = {
  children: ReactNode;
};

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderInfos | null>(null);
  const [shirtModels, setCurrentShirtModels] = useState<ShirtModel[]>([]);
  const [filesUpload, setFilesAux] = useState<File[]>([]);
  const orderInfoLabelStorage = 'currentOrder'
  const shirtModelsLabelStorage = 'shirtModels'

  const setOrderInfos = (order: OrderInfos | null) => {
    setCurrentOrder(order);
    localStorage.setItem(orderInfoLabelStorage, JSON.stringify(order));
  };

  const getOrderInfos = () : OrderInfos => {
    const savedOrder = localStorage.getItem(orderInfoLabelStorage);
    return savedOrder ? JSON.parse(savedOrder) : null;
  };

  const setShirtModels = (models: ShirtModel[]) => {
    setCurrentShirtModels(models);
    localStorage.setItem(shirtModelsLabelStorage, JSON.stringify(models));
  };

  const getShirtModels = () : ShirtModel[] => {
    const savedData = localStorage.getItem(shirtModelsLabelStorage);
    return savedData ? JSON.parse(savedData) : [];
  };

  const getShirtModel = (id: number) : ShirtModel =>{
    const currentModels = getShirtModels()
    console.log(currentModels)
    console.log(id)
    return currentModels[id]
  }

  const getIdModel = (model: ShirtModel) : number =>{
    const currentModels = getShirtModels()
    return currentModels.findIndex(
      (model:ShirtModel) => model.printName.trim() == model.printName.trim() && 
      model.shirtModeling == model.shirtModeling);
  }

  const setFilesUpload = (files: File[]) =>{
    setFilesAux(files)
  }

  const getFilesUpload = () : File[] =>{
    return filesUpload
  }

  const contextValue: OrderContextType = {
    currentOrder,
    filesUpload,
    setOrderInfos,
    getOrderInfos,
    getShirtModels,
    setShirtModels,
    getShirtModel,
    getIdModel,
    setFilesUpload,
    getFilesUpload
  };

  return (
    <OrderContext.Provider value={contextValue}>{children}</OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
