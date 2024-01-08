'use client'
import apiRouter from "@/api/rotas"
import Header from "@/components/Header"
import InputFile from "@/components/Input/InputFile"
import InputSelect from "@/components/Input/InputSelect"
import InputText from "@/components/Input/InputText"
import Navbar from "@/components/Navbar"
import SpecialCaseShirtDisplay from "@/components/SpecialCaseShirtDisplay"
import { useComponentsContext } from "@/context/componentsContext"
import { SizeGrid, SpecialShirtStyle, useOrderContext } from "@/context/orderContext"
import { useServerDataContext } from "@/context/serverDataContext"
import { IconSave } from "@/utils/elements"
import axios from "axios"
import {Option} from '@/components/Input/interfaceInput'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ZodIssue } from "zod"
import Button from "@/components/Button"
import Divider from "@/components/Divider"
import { useAuth } from "@/context/authContext"

export default function Resume({params}: { params:{id: number, idshirtstyle: number, idcase:number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
      collars: Option[]
  }
  
  type FormContent = {
    shirtCollar: number  
    sleeveColor: string
    cuffStyle: string
    specialElement: string
    sizeAdjustment: string
    comments: string
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
  const [filesAtt, setFilesAtt] = useState<File[]>()
  const [casoBase, setCasoBase] = useState<FormContent>({
    comments: '',
    cuffStyle: '',
    shirtCollar: 1,
    sizeAdjustment: '',
    sleeveColor: '',
    specialElement: ''
  });

  async function getFormContent(){
    const current = getShirtModel(params.id)
    const currentStyle = current.shirtStyles[params.idshirtstyle]
    const currentCase = currentStyle.specials?  currentStyle.specials[params.idcase] : null

    if(currentCase)
      setFormContent({
        cuffStyle: currentCase.cuffStyle as string || current.defaultStyle.cuffStyle,
        shirtCollar: currentCase.shirtCollar as number || current.defaultStyle.shirtCollar,
        sizeAdjustment: currentCase.sizeAdjustment as string || current.defaultStyle.sizeAdjustment,
        sleeveColor: currentCase.sleeveColor as string || current.defaultStyle.sleeveColor,
        specialElement: currentCase.specialElement as string || current.defaultStyle.specialElement,
        comments: currentCase.comments as string || current.defaultStyle.comments as string,
      })
    else
      setFormContent({
        cuffStyle: current.defaultStyle.cuffStyle,
        shirtCollar: current.defaultStyle.shirtCollar,
        sizeAdjustment: current.defaultStyle.sizeAdjustment,
        sleeveColor: current.defaultStyle.sleeveColor,
        specialElement: current.defaultStyle.specialElement,
        comments: ''
      })

    setCasoBase({
      cuffStyle: current.defaultStyle.cuffStyle,
      shirtCollar: current.defaultStyle.shirtCollar,
      sizeAdjustment: current.defaultStyle.sizeAdjustment,
      sleeveColor: current.defaultStyle.sleeveColor,
      specialElement: current.defaultStyle.specialElement,
      comments: ''
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
  
    //trata os documentos
    const formData = new FormData();

    const listaAnexos = [] as string[]
    
    filesUpload.forEach((file, index) => {
      formData.append(`file ${index}`, file);
      listaAnexos.push(file.name)
    });
    
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
      
      const currentModels = getShirtModels()
      const currentStyle = currentModels[params.id].shirtStyles[params.idshirtstyle]
      var currentCase = currentStyle.specials? currentStyle.specials[params.idcase] : { comments: '', attachments: [], sizes: undefined }
      
      interface NewCase {
        shirtCollar?: number  
        sleeveColor?: string
        cuffStyle?: string
        specialElement?: string
        sizeAdjustment?: string
        comments?: string
        attachments?: string[]
        sizes?: SizeGrid
      }
      
      var obj : NewCase = {};
      
      if(formContent){
        const formProps: (keyof FormContent)[] = Object.keys(formContent) as (keyof FormContent)[];
        
        var modify = false
        for (const prop of formProps) {
          if (formContent && form[prop].value !== casoBase[prop]) {
            modify = true
            obj[prop] = form[prop].value;
          }
        }

        if(!modify){
          throw new Error('Modifique algum campo para gerar um caso especial')
        }
      }
      
      obj.comments = form.comments.value
      obj.attachments = listaAnexos
      if(currentCase && currentCase.sizes) obj.sizes = currentCase.sizes
      
      
      var x = currentModels[params.id].shirtStyles[params.idshirtstyle].specials
      if (x) x[params.idcase] = obj
      else x = [obj] as SpecialShirtStyle[];
      currentModels[params.id].shirtStyles[params.idshirtstyle].specials = x
      
      setShirtModels(currentModels)
      
      router.push(`/camisa/${params.id}/${params.idshirtstyle}/${params.idcase}/caso-especial/2/`);
  //     setFilesUpload([])
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  return (
    <>
        <Header.Root>
          <Header.BtnReturn goto={'/pedido/produtos'} />
          <Header.Title>Novo Caso Especial</Header.Title>
          <Header.Subtitle>{dataPage?.meshName} - {dataPage?.meshColorName}</Header.Subtitle>
      </Header.Root>

      <form method='post' onSubmit={handleSubmit} style={{margin: '20px 0 40px 0'}}>
        <InputSelect 
          label='Gola' 
          name='shirtCollar' 
          id='shirtCollar'
          defaultValue={formContent?.shirtCollar.toString()}
          required 
          options={dataPage? dataPage.collars : []}
          errors={formErrors} 
        />
        
        <InputText 
          type='text' 
          label='Cor das Mangas' 
          id='sleeveColor' 
          defaultValue={formContent?.sleeveColor}
          name='sleeveColor' 
          errors={formErrors}
        />

        <InputText 
          type='text' 
          label='Punho' 
          defaultValue={formContent?.cuffStyle}
          id='cuffStyle' 
          name='cuffStyle' 
          errors={formErrors}
        />

        <InputText 
          type='text' 
          label='Elemento Especial' 
          defaultValue={formContent?.specialElement}
          id='specialElement' 
          name='specialElement' 
          errors={formErrors}
        />

        <InputText 
          type='text' 
          label='Ajuste de tamanho' 
          defaultValue={formContent?.sizeAdjustment}
          id='sizeAdjustment' 
          name='sizeAdjustment' 
          errors={formErrors}
        />

        <Divider />

        <InputText 
            type='text' 
            label='Observações' 
            id='comments' 
            defaultValue={formContent?.comments}
            name='comments' 
            multiline 
        />

        <InputFile 
            label='Anexos' 
            id='anexos' 
            multiple
        />

        <Button type='submit'>Próximo</Button>
      </form>
    </>
  )
}