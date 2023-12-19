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
import { ShirtModel, useOrderContext } from '@/context/orderContext'
import axios from 'axios'
import LoadingScreen from '@/components/LoadingScreen'
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'

export default function NovaCamisa() {
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
    // e.preventDefault();
    // setLoading(true)

    // const form = e.currentTarget as HTMLFormElement;

    // //validação com zode
    // const dados = validarDados(novaCamisaValidator, {
    //   printName:      form.printName.value,
    //   shirtModeling:     form.shirtModeling.value
    // }) as ReturnValidator;

    // if(!dados.success){
    //   setFormErrors(dados.data as ZodIssue[])
    //   setTimeout(() => {
    //     setFormErrors({} as ZodIssue[]);
    //   }, 4000);
    // } else {
    //   const data = dados.data as ShirtModel
    //   setFormErrors({} as ZodIssue[])
    //   // próxima página

    //   const newModel = {
    //     printName: form.printName.value,
    //     shirtModeling: form.shirtModeling.value,
    //     namePhotoModel: ''
    //   } as ShirtModel

    //   //trata os documentos
    //   const formData = new FormData();

    //   filesUpload.forEach((file, index) => {
    //     formData.append(`file ${index}`, file);
    //     newModel['namePhotoModel'] = file.name
    //   });

    //   const currentModels = getShirtModels()
    //   const modelExists = currentModels.find(
    //     (model:ShirtModel) => model.printName.trim() == newModel.printName.trim() &&
    //     model.shirtModeling == newModel.shirtModeling);

    //   if (!modelExists) currentModels.push(newModel)

    //   setShirtModels(currentModels)

    //   try {
    //     if(filesUpload.length>0)
    //       await axios.post(
    //       apiRouter.fileManager, formData,
    //       {
    //         headers: {
    //           'Authorization': getToken()
    //         },
    //       }
    //     )

    //     router.push(`/nova-camisa/${getIdModel(newModel)}`);
    //   } catch (error) {
    //     toast.error("Erro ao enviar os arquivos. Tente novamente")
    //   }

    // }
    // setLoading(false)
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