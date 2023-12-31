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

export type SpecialShirtStyle={
  shirtCollar?: number
  cuffStyle?: string
  sleeveColor?: string
  sizeAdjustment?: string
  specialElement?: string

  sizes?: SizeGrid

  comments?: string
  attachments?: string[]
  toSave?: boolean
}

export type ShirtStyle = {
  mesh: number
  meshColor: number
  
  sizes?: SizeGrid

  comments?: string
  attachments?: string[]
  specials?: SpecialShirtStyle[]
  toSave?: boolean
}

export type DefaultShirtStyle = {
  shirtCollar: number
  printingTechnique: string
  printingColors: string
  printingPositions: string

  sleeveColor: string
  cuffStyle: string
  specialElement: string
  sizeAdjustment: string

  comments?: string
  attachments?: string[]
}

export type ShirtModel = {
  printName: string
  shirtModeling: number
  shirtStyles: ShirtStyle[]
  number_units: number
  defaultStyle: DefaultShirtStyle
  
  namePhotoModel?: string
};

export type ShirtPrice = {
  precoUnit: number
  descUnit: number
}

export type Prices = {
  order: {
    shipping: number
    subtotal: number
    discount: number
  },
  shirts: ShirtPrice[]
}

export type ShirtStyleDetails = {
  mesh: number
  meshColor: number
  shirtCollar: string
  printingTechnique: string
  printingColors: string
  printingPositions: string
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

export type DataOrderToSend = {
  name: string
  customer_name: string
  customer_phone: string
  shipping_cost: number
  subtotal_value: number
  discount_value: number
  total_number_units: number
  details: string
  status: number
  company: number
  classification: number
}

export type DataOrderResponseWithTexts = {
  negotiation_id: number
  name: string
  customer_name: string
  customer_phone: string
  shipping_cost: number
  subtotal_value: number
  discount_value: number
  total_number_units: number
  details: string
  status: number
  statusName: string
  company: number
  classification: number
}

export type DataOrderResponse = {
  negotiation_id: number
  name: string
  customer_name: string
  customer_phone: string
  shipping_cost: number
  subtotal_value: number
  discount_value: number
  total_number_units: number
  details: string
  status: number
  company: number
  classification: number
}

type OrderContextType = {
  currentOrder: OrderInfos | null;
  setOrderInfos: (order: OrderInfos | null) => void;
  getOrderInfos: () => OrderInfos;

  setShirtModels: (models: ShirtModel[]) => void;
  getShirtModels: () => ShirtModel[];
  getShirtModel: (id: number) => ShirtModel
  getIdModel: (model: ShirtModel) => number

  setPrices: (prices: Prices | null) => void
  getPrices: () => Prices | null

  filesUpload: File[]
  setFilesUpload: (files: File[]) => void;
  getFilesUpload: () => File[];

  fileDownload: File | undefined
  setFileDownload: (file: File) => void;
  getFileDownload: () => File | undefined

  setCurrentOrderId: (id: number) => void;
  getCurrentOrderId: () => number | null

  cleanOrdenContext: ()=>void
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderProviderProps = {
  children: ReactNode;
};

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderInfos | null>(null);
  const [currentOrderId, setCurrentOrderIdAux] = useState<number | null>(null);
  const [shirtModels, setCurrentShirtModels] = useState<ShirtModel[]>([]);
  const [filesUpload, setFilesAux] = useState<File[]>([]);
  const [fileDownload, setFileDownloadAux] = useState<File>();
  const orderInfoLabelStorage = 'currentOrder'
  const shirtModelsLabelStorage = 'shirtModels'
  const pricesLabelStorage = 'prices'
  const currentIdLabelStorage = 'currentId'

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

  const setCurrentOrderId = (id: number | null) =>{
    localStorage.setItem(currentIdLabelStorage, id? id.toString(): '');
  }

  const getCurrentOrderId = () : number | null =>{
    const strNum = localStorage.getItem(currentIdLabelStorage)
    return parseInt(strNum ? strNum: '0')
  }

  const setFileDownload = (file: File | undefined) =>{
    setFileDownloadAux(file)
  }

  const getFileDownload = () : File | undefined =>{
    return fileDownload
  }

  const cleanOrdenContext = () =>{
    setOrderInfos(null)
    setShirtModels([])
    setFilesUpload([])
    setPrices(null)
    setFileDownload(undefined)
    setCurrentOrderId(null)
  }

  const setPrices = (prices: Prices | null) =>{
    localStorage.setItem(pricesLabelStorage, JSON.stringify(prices))
  }

  const getPrices = () : Prices | null =>{
    const savedData = localStorage.getItem(pricesLabelStorage);
    return savedData ? JSON.parse(savedData) : null;
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
    setPrices,
    getPrices,
    setFileDownload,
    getFileDownload,
    setCurrentOrderId,
    getCurrentOrderId
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
