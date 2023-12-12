'use client'
import Header from '@/components/Header'
import { BtnEdicaoHeader, IconBusca, IconHome, IconNovaCamisa, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(private)/main.module.css'
import InputText from '@/components/Input/InputText'
import InputSelect from '@/components/Input/InputSelect'
import Button from '@/components/Button'
import LoadingScreen from '@/components/LoadingScreen'
import InputFile from '@/components/Input/InputFile'

export default function NovaCamisa() {
  type DataHeader={
    nomePedido: string
    nomeCliente: string
    empresa: string
    classificacao: string
  }

  const { getOrderInfos } = useOrderContext()
  const { getCompanies, getClassifications, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<DataHeader>({classificacao: '--', nomeCliente: '--', nomePedido: '--', empresa: '---'})
  const [isLoading, setLoading] = useState(false)

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
          <Header.Title>Nova Camisa</Header.Title>
      </Header.Root>

      <form method='post'>
      
        <InputText type='text' label='Nome da Estampa' name='printName' autoFocus/>

        <InputSelect label='Modelo' name='shirtModeling' options={[]} />

        <InputFile label='Imagem' id={'img'}></InputFile>

        <Button type='submit'>Entrar</Button>
      </form>

      {isLoading && <LoadingScreen/>}

      { 
      // dataPage === null ? (
      //     <>
      //       <Box width={config.WIDTH_WIDGETS} />
      //       <Box width={config.WIDTH_WIDGETS} />
      //       <Box width={config.WIDTH_WIDGETS} />
      //     </>
      //     ) : dataPage.length === 0 ? (
      //     <span className='discreto'>Não há negociações ainda...</span>
      //     ) : (
      //     /* Render your data here, assuming dataNegotiations is an array */
      //     dataPage.map((negotiation, index) => (
      //       <ItemNegociacao customer_name={negotiation.customer_name} name={negotiation.name} total_number_units={negotiation.total_number_units}>
      //         <ItemNegociacaoStatus value={negotiation.status}/>
      //       </ItemNegociacao>
      //     ))
      //   )
        }
    </>
  )
}