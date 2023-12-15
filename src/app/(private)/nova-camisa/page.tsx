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
import toast from 'react-hot-toast'
import { Option } from '@/components/Input/interfaceInput'

export default function NovaCamisa() {
  const { getOrderInfos } = useOrderContext()
  const { getShirtTypes } = useServerDataContext()
  const [dataPage, setDataPage] = useState<Option[]>([])
  const [isLoading, setLoading] = useState(false)

  async function getData() {
    try {
      const dados = await getShirtTypes() as Option []
      if(dados){
        setDataPage(dados)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }

 
  useEffect(() => {
    if(!dataPage.length) getData();
  }, [])

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Nova Camisa</Header.Title>
      </Header.Root>

      <form method='post'>
      
        <InputText type='text' label='Nome da Estampa' name='printName' autoFocus/>

        <InputSelect label='Modelo' name='shirtModeling' options={dataPage} />

        <InputFile label='Imagem' id={'img'}></InputFile>

        <Button type='submit'>Entrar</Button>
      </form>

      {isLoading && <LoadingScreen/>}
    </>
  )
}