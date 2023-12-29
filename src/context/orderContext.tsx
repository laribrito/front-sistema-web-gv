'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

export type OrderInfos = {
  nomePedido: string
  nomeCliente: string
  telefoneCliente: string
  empresa: number
  classificacao: number
  status: number
};

export type InfosSizeGrid = {
  totalFemale: number;
  totalMale: number;
  totalInfant: number;
  grandTotal: number;
};

export type SizeGrid = {
  female:{
     p: number
     m: number
     g: number
    gg: number
    xg: number
  }, 
  male:{
     p: number
     m: number
     g: number
    gg: number
    xg: number
  },
  infant:{
     1: number
     2: number
     4: number
     6: number
     8: number
    10: number
    12: number
  }
}

export function calcularInfosGrade(grid: SizeGrid): InfosSizeGrid {
  const totalFemale =
    grid.female.p + grid.female.m + grid.female.g + grid.female.gg + grid.female.xg;

  const totalMale =
    grid.male.p + grid.male.m + grid.male.g + grid.male.gg + grid.male.xg;

  const totalInfant =
    grid.infant[1] +
    grid.infant[2] +
    grid.infant[4] +
    grid.infant[6] +
    grid.infant[8] +
    grid.infant[10] +
    grid.infant[12];

  const grandTotal = totalFemale + totalMale + totalInfant;

  return {
    totalFemale,
    totalMale,
    totalInfant,
    grandTotal,
  };
}

export type ShirtStyle = {
  mesh: number
  meshColor: number

  shirtCollar?: string
  printingTechnique?: string
  printingColors?: string
  printingPositions?: string

  sleeveColor?: string
  cuffStyle?: string
  specialElement?: string
  
  sizes?: SizeGrid

  comments?: string
  attachments?: string[]
  toSave?: boolean
}

export type ShirtModel = {
  printName: string
  shirtModeling: number
  shirtStyles: ShirtStyle[]
  number_units: number
  
  namePhotoModel?: string
};

export type ShirtPrice = {
  precoUnit: number
  descUnit: number
}

export type ShirtStyleDetails = {
  mesh: number
  meshColor: number
  shirtCollar: string
  printingTechnique: string
  printingColors: string
  printPositions: string
  sleeveColors: string
  cuffStyle: string
  specialElement: string
  comments: string
  attachments: string[]
  sizes: SizeGrid
}

export type ShirtDetails = {
  printName: string
  shirtType: number
  numberUnits: number
  unitPrice: number
  unitDiscount: number
  imageUrl: string
  shirtStyles: ShirtStyleDetails[]
}

type OrderContextType = {
  currentOrder: OrderInfos | null;
  setOrderInfos: (order: OrderInfos | null) => void;
  getOrderInfos: () => OrderInfos;

  setShirtModels: (models: ShirtModel[]) => void;
  getShirtModels: () => ShirtModel[];
  getShirtModel: (id: number) => ShirtModel
  getIdModel: (model: ShirtModel) => number

  setShirtPrices: (prices: ShirtPrice[]) => void
  getShirtPrices: () => ShirtPrice[]

  filesUpload: File[]
  setFilesUpload: (files: File[]) => void;
  getFilesUpload: () => File[];

  fileDownload: File | undefined
  setFileDownload: (file: File) => void;
  getFileDownload: () => File | undefined

  cleanOrdenContext: ()=>void
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderProviderProps = {
  children: ReactNode;
};

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderInfos | null>(null);
  const [shirtModels, setCurrentShirtModels] = useState<ShirtModel[]>([]);
  const [filesUpload, setFilesAux] = useState<File[]>([]);
  const [fileDownload, setFilesDownload] = useState<File>();
  const orderInfoLabelStorage = 'currentOrder'
  const shirtModelsLabelStorage = 'shirtModels'
  const shirtPricesLabelStorage = 'shirtPrices'

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
    return currentModels[id]
  }

  const getIdModel = (model: ShirtModel) : number =>{
    const currentModels = getShirtModels()

    return currentModels.findIndex(
      (shirt:ShirtModel) => shirt.printName.trim() == model.printName.trim() && 
      shirt.shirtModeling == model.shirtModeling)
  }

  const setFilesUpload = (files: File[]) =>{
    setFilesAux(files)
  }

  const getFilesUpload = () : File[] =>{
    return filesUpload
  }

  const setFileDownload = (file: File | undefined) =>{
    setFileDownload(file)
  }

  const getFileDownload = () : File | undefined =>{
    return fileDownload
  }

  const cleanOrdenContext = () =>{
    setOrderInfos(null)
    setShirtModels([])
    setFilesUpload([])
    setShirtPrices([])
    setFileDownload(undefined)
  }

  const setShirtPrices = (prices: ShirtPrice[]) =>{
    localStorage.setItem(shirtPricesLabelStorage, JSON.stringify(prices))
  }

  const getShirtPrices = () : ShirtPrice[] =>{
    const savedData = localStorage.getItem(shirtPricesLabelStorage);
    return savedData ? JSON.parse(savedData) : [];
  }

  const contextValue: OrderContextType = {
    currentOrder,
    filesUpload,
    fileDownload,
    setOrderInfos,
    getOrderInfos,
    getShirtModels,
    setShirtModels,
    getShirtModel,
    getIdModel,
    setFilesUpload,
    getFilesUpload,
    cleanOrdenContext,
    setShirtPrices,
    getShirtPrices,
    setFileDownload,
    getFileDownload
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
