'use client'
import { useEffect, useRef, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { DefaultShirtStyle, InfosSizeGrid, ShirtStyle, SizeGrid, calcularInfosGrade, useOrderContext } from '@/context/orderContext'
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
import Divider from '@/components/Divider'
import SpecialCaseShirtDisplay from '@/components/SpecialCaseShirtDisplay'

function LabelAndContent({label, content}: {label: string, content: number}){
  content = content? content : 0
  return (
    <div className={styles.LabelAndContent}>
      <p className={styles.label}>{label}</p>
      <p>{content}</p>
    </div>
  )
}

export default function Resume({params}: { params:{id: number, mesh: number, meshcolor: number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
      currentStyle?: DefaultShirtStyle
      currentGrid?: SizeGrid
      gridInfo?: InfosSizeGrid
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

  useEffect(() => {
    if (elementoRef.current) {
      const altura = elementoRef.current.offsetHeight;
      setAlturaElemento(altura);
      document.body.scrollTop = 0; // Para navegadores mais antigos
      document.documentElement.scrollTop = 0; // Para navegadores modernos
    }

  }, [elementoRef.current, dataPage?.currentStyle]);

  async function getData() {
    setLoading(true)
    try {
      const meshs = await getMeshs()
      const colorsMeshs = await getMeshColors()

      const currentModels = getShirtModels()
      const currentModel = currentModels[params.id]
      const stylePos = currentModel.shirtStyles.findIndex(
        (style:ShirtStyle) => style.mesh == params.mesh &&
        style.meshColor == params.meshcolor);

      const currentGrid = currentModels[params.id].shirtStyles[stylePos].sizes

      if(meshs && colorsMeshs && currentGrid){
          setDataPage({
              meshName: parseOptionName(meshs, params.mesh) as string,
              meshColorName: parseOptionName(colorsMeshs, params.meshcolor) as string,
              currentStyle: currentModels[params.id].defaultStyle,
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
    const currentModel = currentModels[params.id]
    const stylePos = currentModel.shirtStyles.findIndex(
      (style:ShirtStyle) => style.mesh == params.mesh &&
      style.meshColor == params.meshcolor);

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

      
      currentModels[params.id].shirtStyles[stylePos].attachments = listaAnexos
      currentModels[params.id].shirtStyles[stylePos].comments = form.obs.value
      currentModels[params.id].shirtStyles[stylePos].toSave = true
      
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
            <Divider />
            <h2>Estilo Padrão</h2>
            <ShirtStyleDisplay shirtStyle={dataPage?.currentStyle} refer={elementoRef}/>
            <Divider />
        </div>

        <div className={styles.contentBox} style={{padding: `${alturaElemento+120}px 0px 40px 0px`, width: '100%'}}>
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
            <InputText type='text' label='Observações' id='obs' name='obs' multiline />

            <InputFile label='Anexos' id='anexos' multiple/>

            <ModalYesOrNo 
                  open={cancelModalOpen}
                  question={`Tem certeza que deseja cancelar o cadastro de ${dataPage.meshName} na cor ${dataPage.meshColorName} nessa camisa?`}
                  onConfirm={()=>{
                    setLoading(true)
                    router.push(`/camisa/${params.id}`)
                  }}
                  onClose={()=>{
                    setLoading(false)
                    setCancelModalOpen(false)
                  }}
            />

            {/* <SpecialCaseShirtDisplay>

            </SpecialCaseShirtDisplay> */}

            <Navbar.Root>
              <Navbar.Item icon={IconCancel} goto={()=>{setCancelModalOpen(true)}}>Cancelar<br/>Estilo</Navbar.Item>
              <Navbar.Item icon={IconSave} submit>Salvar</Navbar.Item>
            </Navbar.Root>
          </form>
        </div>
    </>
  )
}