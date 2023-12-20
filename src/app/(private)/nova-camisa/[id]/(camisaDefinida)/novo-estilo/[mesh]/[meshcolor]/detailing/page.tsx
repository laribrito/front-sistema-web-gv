'use client'
import { useEffect, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { ReturnValidator, validarDados } from '@/zod/parseValidation'
import { ZodIssue } from 'zod'
import { ShirtStyle, useOrderContext } from '@/context/orderContext'
import LoadingScreen from '@/components/LoadingScreen'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import { newDetailing01 } from '@/zod/validators'

export default function Detailing01({params}: { params:{id: number, mesh: number, meshcolor: number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
  }

  const router = useRouter()
  const { parseOptionName, getMeshColors, getMeshs } = useServerDataContext()
  const { setShirtModels, getShirtModels } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>({meshName: '---', meshColorName: '---'})
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    try {
        const meshs = await getMeshs()
        const colorsMeshs = await getMeshColors()

        if(meshs && colorsMeshs){
            setDataPage({
                meshName: parseOptionName(meshs, params.mesh) as string,
                meshColorName: parseOptionName(colorsMeshs, params.mesh) as string
            })
        }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
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
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as ShirtStyle
      setFormErrors({} as ZodIssue[])
      // próxima página

      const newModel = {
        mesh: params.mesh,
        meshColor: params.meshcolor,
        shirtCollar: data.shirtCollar,
        printingTechnique: data.printingTechnique,
        printingColors: data.printingColors,
        printingPositions: data.printingPositions,
        
        sleeveColor: data.sleeveColor,
        cuffStyle: data.cuffStyle,
        specialElement: data.specialElement,
      } as ShirtStyle
  
      const currentModels = getShirtModels()
      const currentModel = currentModels[params.id]
      const stylePos = currentModel.shirtStyles.findIndex(
        (style:ShirtStyle) => style.mesh == newModel.mesh &&
        style.meshColor == newModel.meshColor);
  
      currentModels[params.id].shirtStyles[stylePos] = newModel
  
      setShirtModels(currentModels)
         
      router.push(`/nova-camisa/${params.id}/novo-estilo/${params.mesh}/${params.meshcolor}/sizes`);
    }

    setLoading(false)
  }

  return (
    <>
        <div className={styles.malhaDiv}>
            <h1>{dataPage?.meshName}</h1>
            <h2>{dataPage?.meshColorName}</h2>
        </div>

      <form method='post' onSubmit={handleSubmit} style={{margin: '100px 0 40px 0'}}>

        <InputText type='text' label='Gola (tipo/cor)' defaultValue='O' required id='shirtCollar' name='shirtCollar' errors={formErrors}/>
        <InputText type='text' label='Técnica de impressão' defaultValue='Silk Screen' required id='printingTechnique' name='printingTechnique' errors={formErrors}/>
        <InputText type='text' label='Cores Estampa' placeholder='Azul / Vermelho / Diversos' required id='printingColors' name='printingColors' errors={formErrors}/>
        <InputText type='text' label='Posições da Estampa' placeholder='Nuca / Peito Esq' required id='printingPositions' name='printingPositions' errors={formErrors}/>

        <hr className={styles.divisor}/>
        
        <InputText type='text' label='Cor das Mangas' id='sleeveColor' name='sleeveColor' errors={formErrors}/>
        <InputText type='text' label='Punho' id='cuffStyle' name='cuffStyle' errors={formErrors}/>
        <InputText type='text' label='Elemento Especial' id='specialElement' name='specialElement' errors={formErrors}/>

        <Button type='submit'>Próximo</Button>

        {isLoading && <LoadingScreen />}
      </form>
    </>
  )
}