'use client'
import Header from '@/components/Header'
import { ChangeEvent, useEffect, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import InputText from '@/components/Input/InputText'
import InputSelect from '@/components/Input/InputSelect'
import Button from '@/components/Button'
import InputFile from '@/components/Input/InputFile'
import toast from 'react-hot-toast'
import { Option } from '@/components/Input/interfaceInput'
import { ReturnValidator, validarDados } from '@/zod/parseValidation'
import { novaCamisaValidator } from '@/zod/validators'
import { ZodIssue } from 'zod'
import { ShirtModel, ShirtStyle, useOrderContext } from '@/context/orderContext'
import axios from 'axios'
import LoadingScreen from '@/components/LoadingScreen'
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'

export default function NovaCamisa({params}: { params:{id: number}}) {
  type DataPage = {
      meshs: Option[]
      meshColors: Option[]
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { getMeshs, getMeshColors } = useServerDataContext()
  const { setShirtModels, getShirtModels, getIdModel, filesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null)
  const [allMeshColors, setMeshColors] = useState<Option[] | null>(null)
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    try {
      const dados = await getMeshs() as Option []
      if(dados && allMeshColors){
        setDataPage({
          meshs: dados,
          meshColors: allMeshColors.filter((color) => {
            return color.isAvailable == true && color.relation_id == 1;
          }),
        })
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }

  async function getMC() {
    try {
      const dados2 = await getMeshColors() as Option []
      if(dados2){
        setMeshColors(dados2)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }

  useEffect(() => {
    if(!allMeshColors) getMC()
    if(allMeshColors && !dataPage) getData();

  }, [allMeshColors])
  
  const selectMeshColors = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const idMesh = parseInt(selectedValue, 10)
    const currentData = dataPage

    if(currentData && allMeshColors){
      setDataPage({
        meshs: currentData.meshs,
        meshColors: allMeshColors.filter((color) => {
          return color.isAvailable == true && color.relation_id === idMesh;
        }),
      })
    }
  };

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;

    const newModel = {
      mesh: form.mesh.value,
      meshColor: form.meshColor.value
    } as ShirtStyle

    const currentModels = getShirtModels()
    const currentModel = currentModels[params.id]
    const styleExists = currentModel.shirtStyles.find(
      (style:ShirtStyle) => style.mesh == newModel.mesh &&
      style.meshColor == newModel.meshColor);

    if (!styleExists) currentModels[params.id].shirtStyles.push(newModel)

    setShirtModels(currentModels)

    setLoading(false)

    router.push(`/nova-camisa/${params.id}/novo-estilo/${form.mesh.value}/${form.meshColor.value}/detailing`)
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit} style={{marginTop: '20px'}}>
        <InputSelect
          label='Malha'
          name='mesh'
          id='mesh'
          required
          onChange={selectMeshColors}
          options={dataPage && dataPage.meshs}
          errors={formErrors}
        />

        <InputSelect
          label='Cor da malha'
          name='meshColor'
          id='meshColor'
          required
          options={dataPage && dataPage.meshColors}
          errors={formErrors}
        />

        <Button type='submit'>Próximo</Button>

        {isLoading && <LoadingScreen />}
      </form>
    </>
  )
}