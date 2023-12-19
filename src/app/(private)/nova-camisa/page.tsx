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

export default function NovaCamisa() {
  const { getToken } = useAuth()
  const { getShirtTypes } = useServerDataContext()
  const { setShirtModels, getShirtModels, getIdModel, filesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<Option[]>([])
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    try {
      const dados = await getShirtTypes() as Option []
      if(dados){
        setDataPage(dados)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }
 
  useEffect(() => {
    if(!dataPage.length) getData();
  }, [])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;

    //validação com zode
    const dados = validarDados(novaCamisaValidator, {
      printName:      form.printName.value, 
      shirtModeling:     form.shirtModeling.value
    }) as ReturnValidator;
    
    if(!dados.success){
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as ShirtModel
      setFormErrors({} as ZodIssue[])
      // próxima página

      const newModel = {
        printName: form.printName.value,
        shirtModeling: form.shirtModeling.value
      } as ShirtModel

      //trata os documentos
      const formData = new FormData();
    
      filesUpload.forEach((file, index) => {
        formData.append(`file ${index}`, file);
        newModel['namePhotoModel'] = file.name
      });

      const currentModels = getShirtModels()
      const modelExists = currentModels.find(
        (model:ShirtModel) => model.printName.trim() == newModel.printName.trim() && 
        model.shirtModeling == newModel.shirtModeling);

      if (!modelExists) currentModels.push(newModel)

      setShirtModels(currentModels)

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
        
        window.location.href="/nova-camisa/"+ getIdModel(newModel)
      } catch (error) {
        toast.error("Erro ao enviar os arquivos. Tente novamente")
      }

    }

    setLoading(false)
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Nova Camisa</Header.Title>
      </Header.Root>

      <form method='post' onSubmit={handleSubmit}>
      
        <InputText 
          type='text' 
          label='Nome da Estampa' 
          name='printName'
          id='printName'
          required 
          autoFocus
          errors={formErrors}
        />

        <InputSelect 
          label='Modelo' 
          name='shirtModeling' 
          id='shirtModeling'
          required 
          options={dataPage}
          errors={formErrors} 
        />

        <InputFile label='Layout do Modelo' id='arquivo'></InputFile>

        <Button type='submit'>Próximo</Button>

        {isLoading && <LoadingScreen />}
      </form>
    </>
  )
}