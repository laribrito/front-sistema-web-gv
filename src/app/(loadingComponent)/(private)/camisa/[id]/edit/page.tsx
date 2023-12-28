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
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { useComponentsContext } from '@/context/componentsContext'

export default function EditarCamisaInfo({params}:{params: {id: number}}) {
  type FormContent = {
    printName: string
    shirtModeling: string
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { setLoading } = useComponentsContext()
  const { getShirtTypes } = useServerDataContext()
  const { setShirtModels, getShirtModel, getShirtModels, getIdModel, filesUpload, setFilesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<Option[]>([])
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [formContext, setFormContent] = useState<FormContent | null>(null);

  async function getData() {
    setLoading(true)
    try {
      const dados = await getShirtTypes() as Option []
      if(dados){
        setDataPage(dados)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
    setLoading(false)
  }

  async function getFormContent(){
    const current = getShirtModel(params.id)
    setFormContent({
      printName: current.printName,
      shirtModeling: current.shirtModeling.toString()
    })

    //pega imagem do modelo
    if(current.namePhotoModel && current.namePhotoModel!='')
    try {
      const encodedFileName = encodeURIComponent(current.namePhotoModel);
      console.log(current.namePhotoModel)
      console.log(encodedFileName)

      const response = await axios.get(apiRouter.fileManager + encodedFileName, {
        responseType: 'blob', // Indica que a resposta é binária (um arquivo)
      });

      const currentExtension = encodedFileName.split('.').pop(); // Obtém a extensão do arquivo

      let fileType = 'application/octet-stream'; // Tipo padrão

      if(currentExtension){
        fileType = currentExtension.toLowerCase()
        // Verifica se a extensão corresponde a uma imagem
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(currentExtension.toLowerCase())) {
          fileType = 'image/' + fileType;
        }
      }

      const file = new File([response.data], current.namePhotoModel, { type: fileType })
      setFilesUpload([file]);
    } catch (error) {
      toast.error('Erro ao baixar a imagem modelo. Recarregue a página')
    }
  }
 
  useEffect(() => {
    if(!dataPage.length) getData();
    if(!formContext) getFormContent()
  }, [dataPage, formContext])

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
      setLoading(false)
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as ShirtModel
      setFormErrors({} as ZodIssue[])
      // próxima página
      const current = getShirtModel(params.id)

      const newModel = {
        printName: form.printName.value,
        shirtModeling: form.shirtModeling.value,
        namePhotoModel: '',
        shirtStyles: current.shirtStyles,
        number_units: current.number_units
      } as ShirtModel

      //trata os documentos
      const formData = new FormData();
    
      filesUpload.forEach((file, index) => {
        formData.append(`file ${index}`, file);
        newModel['namePhotoModel'] = file.name
      });

      const currentModels = getShirtModels()
      currentModels[params.id] = newModel
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

          
        router.push(`/camisa/${getIdModel(newModel)}`);
        setFilesUpload([])

      } catch (error) {
        setLoading(false)
        toast.error("Erro ao enviar os arquivos. Tente novamente")
      }
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Editar Camisa</Header.Title>
      </Header.Root>

      <form method='post' onSubmit={handleSubmit}>
      
        <InputText 
          type='text' 
          label='Nome da Estampa' 
          name='printName'
          id='printName'
          defaultValue={formContext?.printName}
          required 
          autoFocus
          errors={formErrors}
        />

        <InputSelect 
          label='Modelo' 
          name='shirtModeling' 
          id='shirtModeling'
          defaultValue={formContext?.shirtModeling}
          required 
          options={dataPage}
          errors={formErrors} 
        />

        <InputFile label='Layout do Modelo' id='arquivo'></InputFile>

        <Button type='submit'>Salvar</Button>
      </form>
    </>
  )
}