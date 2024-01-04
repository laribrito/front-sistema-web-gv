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
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { useComponentsContext } from '@/context/componentsContext'
import { SelectChangeEvent } from '@mui/material'

export default function NovaCamisa({params}: { params:{id: number}}) {
  type DataPage = {
      meshs: Option[]
      meshColors: Option[]
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { getMeshs, getMeshColors } = useServerDataContext()
  const { setLoading } = useComponentsContext()
  const { setShirtModels, getShirtModels, getIdModel, filesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null)
  const [allMeshColors, setMeshColors] = useState<Option[] | null>(null)
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);

  async function getData() {
    setLoading(true)
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
    setLoading(false)
  }

  async function getMC() {
    setLoading(true)
    try {
      const dados2 = await getMeshColors() as Option []
      if(dados2){
        setMeshColors(dados2)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
    setLoading(false)
  }

  useEffect(() => {
    if(!allMeshColors) getMC()
    if(allMeshColors && !dataPage) getData();

  }, [allMeshColors])
  
  const selectMeshColors = (event:  SelectChangeEvent<string>) => {
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

    router.push(`/camisa/${params.id}/novo-estilo/${form.mesh.value}/${form.meshColor.value}/sizes`)
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit} style={{marginTop: '20px'}}>
        <InputSelect
          label='Malha'
          name='mesh'
          id='mesh'
          required
          otherOnChange={selectMeshColors}
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
      </form>
    </>
  )
}