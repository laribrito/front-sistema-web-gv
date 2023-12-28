'use client'
import { useEffect, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { ReturnValidator, validarDados } from '@/zod/parseValidation'
import { ZodIssue } from 'zod'
import { ShirtStyle, useOrderContext } from '@/context/orderContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import { newDetailing01 } from '@/zod/validators'
import { useComponentsContext } from '@/context/componentsContext'
import Navbar from '@/components/Navbar'
import { IconNext, IconSave } from '@/utils/elements'

export default function Detailing01({params}: { params:{id: number, idshirtstyle: number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
  }

  type FormContent ={
    shirtCollar: string
    printingTechnique: string
    printingColors: string
    printingPositions: string

    sleeveColor?: string
    cuffStyle?: string
    specialElement?: string
  }

  const router = useRouter()
  const { setLoading } = useComponentsContext()
  const { parseOptionName, getMeshColors, getMeshs } = useServerDataContext()
  const { setShirtModels, getShirtModels, getShirtModel } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>({meshName: '---', meshColorName: '---'})
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [formContent, setFormContent] = useState<FormContent | null>(null)
  const [isNext, setIsNext] = useState<boolean>(false)

  async function getData() {
    setLoading(true)
    try {
      const meshs = await getMeshs()
      const colorsMeshs = await getMeshColors()
      const current = getShirtModel(params.id)
      const style = current.shirtStyles[params.idshirtstyle]

      if(meshs && colorsMeshs){
        setDataPage({
            meshName: parseOptionName(meshs, style.mesh) as string,
            meshColorName: parseOptionName(colorsMeshs, style.meshColor) as string
        })

        setFormContent({
            printingColors: style.printingColors as string,
            printingPositions: style.printingPositions as string,
            printingTechnique: style.printingTechnique as string,
            shirtCollar: style.shirtCollar as string,
            cuffStyle: style.cuffStyle,
            sleeveColor: style.sleeveColor,
            specialElement: style.specialElement
        })
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
    setLoading(false)
  }

  useEffect(() => {
    if(dataPage.meshName=='---' || dataPage.meshColorName=='---') getData();

  }, [])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;

    //validação com zode
    const dados = validarDados(newDetailing01, {
      shirtCollar:      form.shirtCollar.value,
      printingTechnique:      form.printingTechnique.value,
      printingColors:      form.printingColors.value,
      printingPositions:      form.printingPositions.value,

      sleeveColor:      form.sleeveColor.value,
      cuffStyle:      form.cuffStyle.value,
      specialElement:      form.specialElement.value,
    }) as ReturnValidator;
    
    if(!dados.success){
      setLoading(false)
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as ShirtStyle
      setFormErrors({} as ZodIssue[])
      // próxima página

      const current = getShirtModel(params.id)
      const style = current.shirtStyles[params.idshirtstyle]
  
      const currentModels = getShirtModels()
  
      currentModels[params.id].shirtStyles[params.idshirtstyle].mesh = style.mesh
      currentModels[params.id].shirtStyles[params.idshirtstyle].meshColor = style.meshColor
      currentModels[params.id].shirtStyles[params.idshirtstyle].shirtCollar = data.shirtCollar
      currentModels[params.id].shirtStyles[params.idshirtstyle].printingTechnique = data.printingTechnique
      currentModels[params.id].shirtStyles[params.idshirtstyle].printingColors = data.printingColors
      currentModels[params.id].shirtStyles[params.idshirtstyle].printingPositions = data.printingPositions
      currentModels[params.id].shirtStyles[params.idshirtstyle].sleeveColor = data.sleeveColor
      currentModels[params.id].shirtStyles[params.idshirtstyle].cuffStyle = data.cuffStyle
      currentModels[params.id].shirtStyles[params.idshirtstyle].specialElement = data.specialElement
  
      setShirtModels(currentModels)
         
      if(isNext) router.push(`/camisa/${params.id}/${params.idshirtstyle}/sizes`)
      else router.push(`/camisa/${params.id}/`)
    }
  }

  return (
    <>
        <div className={styles.malhaDiv}>
            <h1>{dataPage?.meshName}</h1>
            <h2>{dataPage?.meshColorName}</h2>
        </div>

      <form method='post' onSubmit={handleSubmit} style={{margin: '100px 0 80px 0'}}>

        <InputText type='text' label='Gola (tipo/cor)' defaultValue={formContent?.shirtCollar} required id='shirtCollar' name='shirtCollar' errors={formErrors}/>
        <InputText type='text' label='Técnica de impressão' defaultValue={formContent?.printingTechnique} required id='printingTechnique' name='printingTechnique' errors={formErrors}/>
        <InputText type='text' label='Cores Estampa' defaultValue={formContent?.printingColors} placeholder='Azul / Vermelho / Diversos' required id='printingColors' name='printingColors' errors={formErrors}/>
        <InputText type='text' label='Posições da Estampa' defaultValue={formContent?.printingPositions} placeholder='Nuca / Peito Esq' required id='printingPositions' name='printingPositions' errors={formErrors}/>

        <hr className={styles.divisor}/>
        
        <InputText type='text' label='Cor das Mangas' defaultValue={formContent?.sleeveColor} id='sleeveColor' name='sleeveColor' errors={formErrors}/>
        <InputText type='text' label='Punho' id='cuffStyle' defaultValue={formContent?.cuffStyle} name='cuffStyle' errors={formErrors}/>
        <InputText type='text' label='Elemento Especial' defaultValue={formContent?.specialElement} id='specialElement' name='specialElement' errors={formErrors}/>

        <Navbar.Root>
          <Navbar.Item icon={IconSave} submit >Finalizar<br/>Edição</Navbar.Item>
          <Navbar.Item icon={IconNext} submit onClick={()=>{ setIsNext(true) }}>Próximo</Navbar.Item>
        </Navbar.Root>
      </form>
    </>
  )
}