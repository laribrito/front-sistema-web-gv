'use client'
import styles from '../page.module.css'
import ItemModelo from '@/components/ItemModelo'
import BotaoLateral from '@/components/BotaoLateral'
import ItemCombinacao from '@/components/ItemCombinacao'
import ItemCombinacaoIndicators from '@/components/ItemCombinacao/ItemCombinacaoIndicators'
import Button from '@/components/Button'
import ItemNegociacao from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import ItemAndDescription from '@/components/ItemAndDescription'
import InputText from '@/components/Input/InputText'
import InputSelect from '@/components/Input/InputSelect'
import InputFile from '@/components/Input/InputFile'
import InputRadioGroup from '@/components/Input/RadioGroup'
import { Option } from '@/components/Input/interfaceInput'
import Header from '@/components/Header'
import { BtnEdicaoHeader, IconBusca, IconHome, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import { useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'

export default function DashboardProdutos() {
  type DataHeader={
    nomePedido: string
    nomeCliente: string
    empresa: string
    classificacao: string
  }

  const { accessToken, login, logout } = useAuth();
  const { getOrderInfos } = useOrderContext()
  const { getCompanies } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<Option[]>()

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const companiesData = await getCompanies();
        setDadosHeader(companiesData || []); // Se companiesData for null, define um array vazio
      } catch (error) {
        console.error('Erro ao obter empresas:', error);
        // Trate o erro conforme necessário
      }
    }

    fetchCompanies();
  }, []);

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Novo pedido</Header.Title>
          <Header.Subtitle>Novo pedido</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader}/>
      </Header.Root>
    </>
  )
}