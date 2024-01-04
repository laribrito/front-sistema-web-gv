'use client'
import { useEffect, useRef, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { InfosSizeGrid, SecondShirtStyle, ShirtModel, ShirtStyle, SizeGrid, calcularInfosGrade, useOrderContext } from '@/context/orderContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import ShirtStyleDisplay from '@/components/ShirtStyleDisplay'
import InputFile from '@/components/Input/InputFile'
import axios from 'axios'
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'
import Navbar from '@/components/Navbar'
import { IconBusca, IconCancel, IconHome, IconHomeActive, IconNext, IconNovoPedido, IconRelatorios, IconSave } from '@/utils/elements'
import ModalYesOrNo from '@/components/ModalYesOrNo/indext'
import { useComponentsContext } from '@/context/componentsContext'
import Header from '@/components/Header'
import Divider from '@/components/Divider'

export default function Camisa02() {
  type DataPage = {
    camisa: ShirtModel
    tipoCamisaName: string
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { setLoading } = useComponentsContext()
  const { parseOptionName, getShirtTypes } = useServerDataContext()
  const { setShirtModels, getShirtModels, filesUpload, setFilesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>()
  const [alturaElemento, setAlturaElemento] = useState(0);
  const elementoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementoRef.current) {
      const altura = elementoRef.current.offsetHeight;
      setAlturaElemento(altura);
      document.body.scrollTop = 0; // Para navegadores mais antigos
      document.documentElement.scrollTop = 0; // Para navegadores modernos
    }

  }, [elementoRef.current, dataPage?.camisa]);

  async function getData() {
    setLoading(true)
    try {
      const shirtTypes = await getShirtTypes()

      const currentModels = getShirtModels()
      const currentModel = currentModels[currentModels.length-1]

      if(shirtTypes){
          setDataPage({
            camisa: currentModel,
            tipoCamisaName: parseOptionName(shirtTypes ,currentModel.shirtModeling) as string
          })
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
    setLoading(false)
  }

  useEffect(() => {
    if(!dataPage) getData();

  }, [dataPage])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;
 
    //trata os documentos
    const formData = new FormData();

    const listaAnexos = [] as string[]
    
    filesUpload.forEach((file, index) => {
      formData.append(`file ${index}`, file);
      listaAnexos.push(file.name)
    });

    const currentModels = getShirtModels()

    try {
      if(filesUpload.length>0) 
        await axios.post(
        apiRouter.fileManager, formData,
        {
          headers: {
            'Authorization': getToken()
          },
        }
      )
      
      currentModels[currentModels.length-1].defaultStyle.attachments = listaAnexos
      currentModels[currentModels.length-1].defaultStyle.comments = form.obs.value
      
      setShirtModels(currentModels)
      
      router.push(`/camisa/${currentModels.length-1}/`);
      setFilesUpload([])
    } catch (error) {
      setLoading(false)
      toast.error("Erro ao enviar os arquivos. Tente novamente")
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Nova Camisa</Header.Title>
      </Header.Root>

      <div className={styles.malhaDiv}>
        <h1>{dataPage?.camisa.printName}</h1>
        <h2>{dataPage?.tipoCamisaName}</h2>
        {/* <h2>{dataPage?.meshColorName}</h2> */}
        <Divider></Divider>
        <ShirtStyleDisplay shirtStyle={dataPage?.camisa.defaultStyle} refer={elementoRef} />
        <Divider></Divider>
      </div>

      <form method='post' onSubmit={handleSubmit} style={{padding: `${alturaElemento+80}px 0px 40px 0px`, width: '100%'}}>
        <InputText type='text' label='Observações' id='obs' name='obs' multiline />
        <InputFile label='Anexos' id='anexos' multiple/>

        <Button type='submit'>Cadastrar</Button>


      </form>
    </>
  )
}