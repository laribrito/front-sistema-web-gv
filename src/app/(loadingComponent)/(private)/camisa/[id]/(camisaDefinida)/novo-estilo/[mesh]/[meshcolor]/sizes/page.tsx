'use client'
import { useEffect, useRef, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { ShirtStyle, SizeGrid, calcularInfosGrade, useOrderContext } from '@/context/orderContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import ShirtStyleDisplay from '@/components/ShirtStyleDisplay'
import { useComponentsContext } from '@/context/componentsContext'

export default function Sizes({params}: { params:{id: number, mesh: number, meshcolor: number}}) {
  type DataPage = {
      meshName: string
      meshColorName: string
      currentStyle?: ShirtStyle
  }

  const router = useRouter()
  const { setLoading } = useComponentsContext()
  const { parseOptionName, getMeshColors, getMeshs } = useServerDataContext()
  const { setShirtModels, getShirtModels } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>({meshName: '---', meshColorName: '---'})
  const [alturaElemento, setAlturaElemento] = useState(0);
  const elementoRef = useRef<HTMLDivElement>(null);

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

        if(meshs && colorsMeshs){
            setDataPage({
                meshName: parseOptionName(meshs, params.mesh) as string,
                meshColorName: parseOptionName(colorsMeshs, params.meshcolor) as string,
                currentStyle: currentModels[params.id].shirtStyles[stylePos]
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

    //validação 
    const newGrid = {
      female: {
        p:  form.babyP.value?   parseInt(form.babyP.value):  0,
        m:  form.babyM.value?   parseInt(form.babyM.value):  0,
        g:  form.babyG.value?   parseInt(form.babyG.value):  0,
        gg: form.babyGG.value?  parseInt(form.babyGG.value): 0,
        xg: form.babyXG.value?  parseInt(form.babyGG.value): 0
      },
      male: {
        p:  form.mascP.value?   parseInt(form.mascP.value):  0,
        m:  form.mascM.value?   parseInt(form.mascM.value):  0,
        g:  form.mascG.value?   parseInt(form.mascG.value):  0,
        gg: form.mascGG.value?  parseInt(form.mascGG.value): 0,
        xg: form.mascXG.value?  parseInt(form.mascGG.value): 0
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
      const currentModel = currentModels[params.id]
      const stylePos = currentModel.shirtStyles.findIndex(
        (style:ShirtStyle) => style.mesh == params.mesh &&
        style.meshColor == params.meshcolor);
      currentModels[params.id].shirtStyles[stylePos].sizes = newGrid
      
      setShirtModels(currentModels)

      router.push(`/camisa/${params.id}/novo-estilo/${params.mesh}/${params.meshcolor}/resume`);
    }
  }

  return (
    <>
        <div className={styles.malhaDiv}>
            <h1>{dataPage?.meshName}</h1>
            <h2>{dataPage?.meshColorName}</h2>
            <hr className={styles.divisor} />
            
            <ShirtStyleDisplay shirtStyle={dataPage?.currentStyle} refer={elementoRef}/>
        </div>

      <form method='post' onSubmit={handleSubmit} style={{margin: `${alturaElemento+100}px 0 40px 0`}}>
        <h3>Babylooks:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' label='P' id='babyP' name='babyP' tosize/>
          <InputText type='text' label='M' id='babyM' name='babyM' tosize/>
          <InputText type='text' label='G' id='babyG' name='babyG' tosize/>
          <InputText type='text' label='GG' id='babyGG' name='babyGG' tosize/>
          <InputText type='text' label='XG' id='babyXG' name='babyXG' tosize/>
        </div>

        <h3>Masculinas:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' label='P' id='mascP' name='mascP' tosize/>
          <InputText type='text' label='M' id='mascM' name='mascM' tosize/>
          <InputText type='text' label='G' id='mascG' name='mascG' tosize/>
          <InputText type='text' label='GG' id='mascGG' name='mascGG' tosize/>
          <InputText type='text' label='XG' id='mascXG' name='mascXG' tosize/>
        </div>

        <h3>Infantis:</h3>
        <div className={styles.gridSizes}>
          <InputText type='text' label='1' id='ano1' name='ano1' tosize/>
          <InputText type='text' label='2' id='ano2' name='ano2' tosize/>
          <InputText type='text' label='4' id='ano4' name='ano4' tosize/>
          <InputText type='text' label='6' id='ano6' name='ano6' tosize/>
          <InputText type='text' label='8' id='ano8' name='ano8' tosize/>
          <InputText type='text' label='10' id='ano10' name='ano10' tosize/>
          <InputText type='text' label='12' id='ano12' name='ano12' tosize/>
        </div>

        <Button type='submit'>Próximo</Button>
      </form>
    </>
  )
}