'use client'
import { useEffect, useRef, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { InfosSizeGrid, ShirtStyle, SizeGrid, calcularInfosGrade, useOrderContext } from '@/context/orderContext'
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

function LabelAndContent({label, content}: {label: string, content: number}){
  content = content? content : 0
  return (
    <div className={styles.LabelAndContent}>
      <p className={styles.label}>{label}</p>
      <p>{content}</p>
    </div>
  )
}

export default function Resume({params}: { params:{id: number, idshirtstyle: number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
      currentStyle?: ShirtStyle
      currentGrid?: SizeGrid
      gridInfo?: InfosSizeGrid
  }

  type FormContent = {
    obs: string
    attachments: string[]
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { setLoading } = useComponentsContext()
  const { parseOptionName, getMeshColors, getMeshs } = useServerDataContext()
  const { setShirtModels, getShirtModels, filesUpload, setFilesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>({meshName: '---', meshColorName: '---'})
  const [alturaElemento, setAlturaElemento] = useState(0);
  const elementoRef = useRef<HTMLDivElement>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [formContent, setFormContent] = useState<FormContent|null> (null)
  const [filesAtt, setFilesAtt] = useState<File[]>()

  useEffect(() => {
    if (elementoRef.current) {
      const altura = elementoRef.current.offsetHeight;
      setAlturaElemento(altura);
      document.body.scrollTop = 0; // Para navegadores mais antigos
      document.documentElement.scrollTop = 0; // Para navegadores modernos
    }

  }, [elementoRef.current, dataPage?.currentStyle]);

async function getFormContent() {
  try {
    setLoading(true);

    const currentModels = getShirtModels();
    const current = currentModels[params.id].shirtStyles[params.idshirtstyle];

    const attachments = current.attachments as string[];
    const obs = current.comments as string;

    setFormContent({
      attachments,
      obs,
    });

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
      });

      const files = await Promise.all(filePromises);
    }
  } catch (error) {
    console.error('Erro ao obter o conteúdo do formulário:', error);
    toast.error('Erro ao obter o conteúdo do formulário. Recarregue a página.');
  } finally {
    setLoading(false);
  }
}
  async function getData() {
    setLoading(true)
    try {
      const meshs = await getMeshs()
      const colorsMeshs = await getMeshColors()

      const currentModels = getShirtModels()
      const currentStyle = currentModels[params.id].shirtStyles[params.idshirtstyle]

      const currentGrid = currentStyle.sizes

      if(meshs && colorsMeshs && currentGrid){
          setDataPage({
              meshName: parseOptionName(meshs, currentStyle.mesh) as string,
              meshColorName: parseOptionName(colorsMeshs, currentStyle.meshColor) as string,
              currentStyle: currentStyle,
              currentGrid: currentGrid,
              gridInfo: calcularInfosGrade(currentGrid),
          })
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
    setLoading(false)
  }

  useEffect(() => {
    if(dataPage.meshName=='---' || dataPage.meshColorName=='---') getData();
    if(!formContent) getFormContent()
  }, [dataPage])

  useEffect(()=>{
    console.log('foi')
  },[formContent])

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

      
      currentModels[params.id].shirtStyles[params.idshirtstyle].attachments = listaAnexos
      currentModels[params.id].shirtStyles[params.idshirtstyle].comments = form.obs.value
      
      var numberShirt = 0
      currentModels[params.id].shirtStyles.forEach((shirtStyle, index)=>{
        if(shirtStyle.sizes){
          const infos = calcularInfosGrade(shirtStyle.sizes)
          numberShirt+=infos.grandTotal
        }
      })
      
      currentModels[params.id].number_units = numberShirt
      
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
        <div className={styles.malhaDiv}>
            <h1>{dataPage?.meshName}</h1>
            <h2>{dataPage?.meshColorName}</h2>
            <hr className={styles.divisor} />
            <ShirtStyleDisplay shirtStyle={dataPage?.currentStyle} refer={elementoRef}/>
            <hr className={styles.divisor} />
        </div>

        <div className={styles.contentBox} style={{padding: `${alturaElemento+100}px 0px 40px 0px`, width: '100%'}}>
            { dataPage.currentGrid &&
            <>
              {dataPage.gridInfo?.totalFemale!=0 && 
                <>
                  <h3>Babylooks:</h3>
                  <div className={styles.gridSizes}>
                    <LabelAndContent label='P' content={dataPage.currentGrid?.female.p} />
                    <LabelAndContent label='M' content={dataPage.currentGrid?.female.m} />
                    <LabelAndContent label='G' content={dataPage.currentGrid?.female.g} />
                    <LabelAndContent label='GG' content={dataPage.currentGrid?.female.gg} />
                    <LabelAndContent label='XG' content={dataPage.currentGrid?.female.xg} />
                  </div>
                </>
              } 

              {dataPage.gridInfo?.totalMale!=0 && 
                <>
                  <h3>Masculinas:</h3>
                  <div className={styles.gridSizes}>
                    <LabelAndContent label='P' content={dataPage.currentGrid?.male.p} />
                    <LabelAndContent label='M' content={dataPage.currentGrid?.male.m} />
                    <LabelAndContent label='G' content={dataPage.currentGrid?.male.g} />
                    <LabelAndContent label='GG' content={dataPage.currentGrid?.male.gg} />
                    <LabelAndContent label='XG' content={dataPage.currentGrid?.male.xg} />
                  </div>
                </>
              }  

              {dataPage.gridInfo?.totalInfant!=0 && 
                <>
                  <h3>Infantis:</h3>
                  <div className={styles.gridSizes}>
                    <LabelAndContent label='1' content={dataPage.currentGrid?.infant[1]} />
                    <LabelAndContent label='2' content={dataPage.currentGrid?.infant[2]} />
                    <LabelAndContent label='4' content={dataPage.currentGrid?.infant[4]} />
                    <LabelAndContent label='6' content={dataPage.currentGrid?.infant[6]} />
                    <LabelAndContent label='8' content={dataPage.currentGrid?.infant[8]} />
                    <LabelAndContent label='10' content={dataPage.currentGrid?.infant[10]} />
                    <LabelAndContent label='12' content={dataPage.currentGrid?.infant[12]} />
                  </div>
                </>
              }                
            </>
            }

          <form method='post' onSubmit={handleSubmit} style={{marginTop: '20px', marginBottom: '80px'}}>
            <InputText type='text' defaultValue={formContent?.obs} label='Observações' id='obs' name='obs' multiline />

            <InputFile label='Anexos' id='anexos' multiple/>

            <Navbar.Root>
              <Navbar.Item icon={IconSave} submit>Salvar</Navbar.Item>
            </Navbar.Root>
          </form>
        </div>
    </>
  )
}