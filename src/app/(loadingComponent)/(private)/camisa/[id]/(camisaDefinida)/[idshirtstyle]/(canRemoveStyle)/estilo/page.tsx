'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import { useServerDataContext } from '@/context/serverDataContext'
import InputSelect from '@/components/Input/InputSelect'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { Option } from '@/components/Input/interfaceInput'
import { ZodIssue } from 'zod'
import { ShirtStyle, useOrderContext } from '@/context/orderContext'
import { useRouter } from 'next/navigation'
import { useComponentsContext } from '@/context/componentsContext'
import Navbar from '@/components/Navbar'
import { IconNext, IconSave } from '@/utils/elements'
import { SelectChangeEvent } from '@mui/material'

export default function EditarCamisa({params}: { params:{id: number, idshirtstyle: number}}) {
  type DataPage = {
      meshs: Option[]
      meshColors: Option[]
  }

  type FormContent = {
    mesh: string
    meshColor: string
  }

  const router = useRouter()
  const { getMeshs, getMeshColors } = useServerDataContext()
  const { setLoading } = useComponentsContext()
  const { setShirtModels, getShirtModel, getShirtModels } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null)
  const [allMeshColors, setMeshColors] = useState<Option[] | null>(null)
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[])
  const [formContent, setFormContent] = useState<FormContent | null>(null)
  const [isNext, setIsNext] = useState<boolean>(false)

  async function getData() {
    setLoading(true)
    try {
      const dados = await getMeshs() as Option []
      const current = getShirtModel(params.id)
      const style = current.shirtStyles[params.idshirtstyle]

      if(dados && allMeshColors){
        setDataPage({
          meshs: dados,
          meshColors: allMeshColors.filter((color) => {
            return color.isAvailable == true && color.relation_id == style.mesh;
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

  function getFormContent(){
    setLoading(true)
    const current = getShirtModel(params.id)
    const model = current.shirtStyles[params.idshirtstyle]

    setFormContent({
      mesh: (model.mesh).toString(),
      meshColor: (model.meshColor).toString()
    })
    setLoading(false)
  }

  useEffect(() => {
    if(!allMeshColors) getMC()
    if(allMeshColors && !dataPage) getData();
    if(!formContent) getFormContent()

  }, [allMeshColors])
  
  const selectMeshColors = (event:  SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const idMesh = parseInt(selectedValue, 10)
    const currentData = dataPage

    if(currentData && allMeshColors){
      setFormContent(null)
      
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
    
    currentModels[params.id].shirtStyles[params.idshirtstyle].mesh = newModel.mesh
    currentModels[params.id].shirtStyles[params.idshirtstyle].meshColor = newModel.meshColor    

    setShirtModels(currentModels)

    if(isNext) router.push(`/camisa/${params.id}/${params.idshirtstyle}/detailing`)
    else router.push(`/camisa/${params.id}/`)
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit} style={{marginTop: '20px'}}>
        <InputSelect
          label='Malha'
          name='mesh'
          id='mesh'
          required
          defaultValue={formContent? formContent.mesh : ''}
          otherOnChange={selectMeshColors}
          options={dataPage && dataPage.meshs}
          errors={formErrors}
        />

        <InputSelect
          label='Cor da malha'
          name='meshColor'
          id='meshColor'
          defaultValue={formContent? formContent.meshColor : ''}
          required
          options={dataPage && dataPage.meshColors}
          errors={formErrors}
        />

        <Navbar.Root>
          <Navbar.Item icon={IconSave} submit >Finalizar<br/>Edição</Navbar.Item>
          <Navbar.Item icon={IconNext} submit onClick={()=>{ setIsNext(true) }}>Próximo</Navbar.Item>
        </Navbar.Root>
      </form>
    </>
  )
}