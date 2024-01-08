'use client'
import apiRouter from "@/api/rotas"
import Header from "@/components/Header"
import InputFile from "@/components/Input/InputFile"
import InputSelect from "@/components/Input/InputSelect"
import InputText from "@/components/Input/InputText"
import Navbar from "@/components/Navbar"
import SpecialCaseShirtDisplay from "@/components/SpecialCaseShirtDisplay"
import { useComponentsContext } from "@/context/componentsContext"
import { DefaultShirtStyle, SizeGrid, SpecialShirtStyle, calcularInfosGrade, useOrderContext } from "@/context/orderContext"
import { useServerDataContext } from "@/context/serverDataContext"
import { IconSave } from "@/utils/elements"
import axios from "axios"
import styles from './page.module.css'
import {Option} from '@/components/Input/interfaceInput'
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { ZodIssue } from "zod"
import Button from "@/components/Button"
import Divider from "@/components/Divider"
import { useAuth } from "@/context/authContext"
import ShirtStyleDisplay from "@/components/ShirtStyleDisplay"

export default function Resume({params}: { params:{id: number, idshirtstyle: number, idcase:number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
      collars: Option[]
  }
  
  type FormContent = {
    currentStyle: DefaultShirtStyle
    sizes: SizeGrid | null
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { setLoading } = useComponentsContext()
  const { parseOptionName, getMeshColors, getMeshs, getCollars } = useServerDataContext()
  const { setShirtModels, getShirtModels, getShirtModel, filesUpload, setFilesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>({meshName: '---', meshColorName: '---', collars: []})
  const [alturaElemento, setAlturaElemento] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [formContent, setFormContent] = useState<FormContent|null> (null)
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const elementoRef = useRef<HTMLDivElement>(null);

  const [filesAtt, setFilesAtt] = useState<File[]>()

  async function getFormContent(){
    const current = getShirtModel(params.id)
    const currentStyle = current.shirtStyles[params.idshirtstyle]
    const currentCase = currentStyle.specials?  currentStyle.specials[params.idcase] : null

    if(currentCase)
      setFormContent({
        currentStyle:{
          cuffStyle: currentCase.cuffStyle as string || current.defaultStyle.cuffStyle,
          shirtCollar: currentCase.shirtCollar as number || current.defaultStyle.shirtCollar,
          sizeAdjustment: currentCase.sizeAdjustment as string || current.defaultStyle.sizeAdjustment,
          sleeveColor: currentCase.sleeveColor as string || current.defaultStyle.sleeveColor,
          specialElement: currentCase.specialElement as string || current.defaultStyle.specialElement,
          comments: currentCase.comments as string || current.defaultStyle.comments as string,
          printingColors: current.defaultStyle.printingColors,
          printingPositions: current.defaultStyle.printingPositions,
          printingTechnique: current.defaultStyle.printingTechnique,
        },
        sizes: currentCase.sizes || null
      })
    else
      setFormContent({
        currentStyle: {
          cuffStyle: current.defaultStyle.cuffStyle,
          shirtCollar: current.defaultStyle.shirtCollar,
          sizeAdjustment: current.defaultStyle.sizeAdjustment,
          sleeveColor: current.defaultStyle.sleeveColor,
          specialElement: current.defaultStyle.specialElement,
          comments: '',
          printingColors: current.defaultStyle.printingColors,
          printingPositions: current.defaultStyle.printingPositions,
          printingTechnique: current.defaultStyle.printingTechnique,
        },
        sizes: null
      })

    // Pega imagens
    var attachments = [] as string[]
    if(currentCase) attachments = currentCase.attachments as string[]

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
  }
  async function getData() {
    setLoading(true)
    try {
      const meshs = await getMeshs()
      const colorsMeshs = await getMeshColors()
      const collars = await getCollars()

      const currentModels = getShirtModels()
      const currentStyle = currentModels[params.id].shirtStyles[params.idshirtstyle]

      if(meshs && colorsMeshs && collars){
          setDataPage({
              meshName: parseOptionName(meshs, currentStyle.mesh) as string,
              meshColorName: parseOptionName(colorsMeshs, currentStyle.meshColor) as string,
              collars: collars
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

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;

    //validação 
    const newGrid = {
      female: {
        p:  form.babyP.value?   parseInt(form.babyP.value):  0,
        m:  form.babyM.value?   parseInt(form.babyM.value):  0,
        g:  form.babyG.value?   parseInt(form.babyG.value):  0,
        gg: form.babyGG.value?  parseInt(form.babyGG.value): 0,
        xg: form.babyXG.value?  parseInt(form.babyXG.value): 0
      },
      male: {
        p:  form.mascP.value?   parseInt(form.mascP.value):  0,
        m:  form.mascM.value?   parseInt(form.mascM.value):  0,
        g:  form.mascG.value?   parseInt(form.mascG.value):  0,
        gg: form.mascGG.value?  parseInt(form.mascGG.value): 0,
        xg: form.mascXG.value?  parseInt(form.mascXG.value): 0
      },
      infant:{
        1:  form.ano1.value?  parseInt(form.ano1.value):  0,
        2:  form.ano2.value?  parseInt(form.ano2.value):  0,
        4:  form.ano4.value?  parseInt(form.ano4.value):  0,
        6:  form.ano6.value?  parseInt(form.ano6.value):  0,
        8:  form.ano8.value?  parseInt(form.ano8.value):  0,
        10: form.ano10.value? parseInt(form.ano10.value): 0,
        12: form.ano12.value? parseInt(form.ano12.value): 0,
      }
    } as SizeGrid

    const infos = calcularInfosGrade(newGrid)
    if(infos.grandTotal==0){
      setLoading(false)
      toast.error('Preencha algum tamanho de camisa')
    } else {
      const currentModels = getShirtModels()
      const currentStyle = currentModels[params.id].shirtStyles[params.idshirtstyle]
      const currentCase = currentStyle.specials? currentStyle.specials[params.idcase] : null
      
      if(currentCase && currentStyle.specials){
        currentCase.sizes = newGrid
        currentStyle.specials[params.idcase] = currentCase
        currentModels[params.id].shirtStyles[params.idshirtstyle] = currentStyle

        setShirtModels(currentModels)

        setLoading(true)
        router.back()
        router.back()
      }
    }
  }

  return (
    <>
        <Header.Root>
          <Header.BtnReturn goto={'/pedido/produtos'} />
          <Header.Title>Novo Caso Especial</Header.Title>
          <Header.Subtitle>{dataPage?.meshName} - {dataPage?.meshColorName}</Header.Subtitle>
      </Header.Root>
      <ShirtStyleDisplay shirtStyle={formContent?.currentStyle} refer={elementoRef} style={{marginTop:'10px'}}/>

      <form method='post' onSubmit={handleSubmit} style={{margin: `${alturaElemento+20}px 0 80px 0`}}>
        <h3>Babylooks:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' defaultValue={formContent?.sizes?.female.p } label='P' id='babyP' name='babyP' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.female.m } label='M' id='babyM' name='babyM' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.female.g } label='G' id='babyG' name='babyG' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.female.gg} label='GG' id='babyGG' name='babyGG' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.female.xg} label='XG' id='babyXG' name='babyXG' tosize/>
        </div>

        <h3>Masculinas:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' defaultValue={formContent?.sizes?.male.p } label='P' id='mascP' name='mascP' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.male.m } label='M' id='mascM' name='mascM' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.male.g } label='G' id='mascG' name='mascG' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.male.gg} label='GG' id='mascGG' name='mascGG' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.male.xg} label='XG' id='mascXG' name='mascXG' tosize/>
        </div>

        <h3>Infantis:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[ 1]} label='1' id='ano1' name='ano1' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[ 2]}label='2' id='ano2' name='ano2' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[ 4]}label='4' id='ano4' name='ano4' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[ 6]}label='6' id='ano6' name='ano6' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[ 8]}label='8' id='ano8' name='ano8' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[10]}label='10' id='ano10' name='ano10' tosize/>
          <InputText type='text' defaultValue={formContent?.sizes?.infant[12]}label='12' id='ano12' name='ano12' tosize/>
        </div>

        <Button type='submit'>Salvar</Button>
      </form>
    </>
  )
}