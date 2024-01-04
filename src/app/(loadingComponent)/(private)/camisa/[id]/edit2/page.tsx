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

export default function Camisa02({params}:{params: {id: number}}) {
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
  const [formContent, setFormContent] = useState<string[] | null>(null)

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
      const currentModel = currentModels[params.id]

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

  async function getFormContent() {
    try {
      setLoading(true);
  
      const currentModels = getShirtModels();
      const current = currentModels[params.id];
  
      const attachments = current.defaultStyle.attachments as string[];
  
      setFormContent(attachments);
  
      // Pega imagem do modelo
      if (attachments?.length) {
        const filePromises = attachments.map(async (name) => {
          try {
            const encodedFileName = encodeURIComponent(name);
            const response = await axios.get(apiRouter.fileManager + encodedFileName, {
              responseType: 'blob',
            });
  
            const currentExtension = encodedFileName.split('.').pop();
            let fileType = 'application/octet-stream';
  
            if (currentExtension) {
              fileType = currentExtension.toLowerCase();
  
              if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(currentExtension.toLowerCase())) {
                fileType = 'image/' + fileType;
              }
            }
  
            const file = new File([response.data], name, { type: fileType });
            return file;
          } catch (error) {
            // Trate o erro específico para cada imagem ou adote uma abordagem geral
            console.error(`Erro ao baixar a imagem ${name}:`, error);
            throw new Error('Erro ao baixar uma ou mais imagens. Recarregue a página.');
          }
        })

        const files = await Promise.all(filePromises);
        setFilesUpload(files)
      }
    } catch (error) {
      console.error('Erro ao obter o conteúdo do formulário:', error);
      toast.error('Erro ao obter o conteúdo do formulário. Recarregue a página.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!dataPage) getData();
    if(!formContent) getFormContent()
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
      
      currentModels[params.id].defaultStyle.attachments = listaAnexos
      currentModels[params.id].defaultStyle.comments = form.obs.value
      
      setShirtModels(currentModels)
      
      router.push(`/camisa/${params.id}/`);
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
        <Divider></Divider>
        <ShirtStyleDisplay shirtStyle={dataPage?.camisa.defaultStyle} refer={elementoRef} />
        <Divider></Divider>
      </div>

      <form method='post' onSubmit={handleSubmit} style={{padding: `${alturaElemento+90}px 0px 40px 0px`, width: '100%'}}>
        <InputText 
            type='text' 
            label='Observações' 
            id='obs' 
            defaultValue={dataPage?.camisa.defaultStyle.comments}
            name='obs' 
            multiline 
        />
        <InputFile 
            label='Anexos' 
            id='anexos' 
            multiple
        />

        <Button type='submit'>Salvar</Button>
      </form>
    </>
  )
}