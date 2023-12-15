'use client'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import InputText from '@/components/Input/InputText'
import InputSelect from '@/components/Input/InputSelect'
import Button from '@/components/Button'
import InputFile from '@/components/Input/InputFile'
import toast from 'react-hot-toast'
import { Option } from '@/components/Input/interfaceInput'

export default function NovaCamisa() {
  const { getShirtTypes } = useServerDataContext()
  const [dataPage, setDataPage] = useState<Option[]>([])

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
    </>
  )
}