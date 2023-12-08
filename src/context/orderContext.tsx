'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

export type OrderDetails = {
  // Defina a estrutura dos detalhes do pedido
  nomePedido: string
  nomeCliente: string
  telefoneCliente: string
  empresa: number
  classificacao: number
  status: number
};

type OrderContextType = {
  currentOrder: OrderDetails | null;
  setOrder: (order: OrderDetails | null) => void;
  getOrder: () => OrderDetails;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderProviderProps = {
  children: ReactNode;
};

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);

  const setOrder = (order: OrderDetails | null) => {
    setCurrentOrder(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
  };

  const getOrder = () => {
    // Recupera o valor do localStorage
    const savedOrder = localStorage.getItem('currentOrder');

    // Se houver um valor, converte para objeto; senão, retorna null
    return savedOrder ? JSON.parse(savedOrder) : null;
  };

  const contextValue: OrderContextType = {
    currentOrder,
    setOrder,
    getOrder
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
