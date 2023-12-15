'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader, IconBusca, IconHome, IconNovaCamisa, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(private)/main.module.css'

export default function DashboardProdutos() {
  type DataHeader={
    nomePedido: string
    nomeCliente: string
    empresa: string
    classificacao: string
  }

  const { getOrderInfos } = useOrderContext()
  const { getCompanies, getClassifications, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<DataHeader>({classificacao: '--', nomeCliente: '--', nomePedido: '--', empresa: '---'})

  useEffect(() => {
    async function fetchDataInfo() {
      try {
        const pedidoInfo = getOrderInfos() as OrderInfos

        const companiesData = await getCompanies();
        const empresa = (companiesData)? parseOptionName(companiesData, pedidoInfo.empresa):''

        const classifData = await getClassifications();
        const classif = (classifData)? parseOptionName(classifData, pedidoInfo.classificacao):''

        setDadosHeader({
          nomePedido: pedidoInfo.nomePedido,
          nomeCliente: pedidoInfo.nomeCliente,
          empresa: empresa,
          classificacao: classif
        } as DataHeader); // Se companiesData for null, define um array vazio
      } catch (error) {
        console.error('Erro ao obter empresas:', error);
        // Trate o erro conforme necessário
      }
    }

    fetchDataInfo();
  }, []);

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>{dadosHeader?.nomePedido}</Header.Title>
          <Header.Subtitle>{dadosHeader?.nomeCliente}</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader}/>
      </Header.Root>

      <div className={styles.grid}>
        <h1>{dadosHeader?.empresa}</h1>
        <h2>{dadosHeader.classificacao}</h2>
      </div>

      <div className={styles.spanBox}>
        <span className={mainStyles.labelDiscreto}>Cadastre modelos</span>
      </div>

      <Navbar.Root>
        <Navbar.Item icon={IconNovaCamisa}>Nova Camisa</Navbar.Item>
      </Navbar.Root>
    </>
  )
}