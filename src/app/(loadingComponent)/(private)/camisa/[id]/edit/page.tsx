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
import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import { useComponentsContext } from '@/context/componentsContext'
import Divider from '@/components/Divider'

export default function EditarCamisaInfo({params}:{params: {id: number}}) {
  type FormContent = {
    printName: string
    shirtModeling: string
  }

  type DataPage = {
    shirtTypes: Option[]
    collars: Option[]
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { setLoading } = useComponentsContext()
  const { getShirtTypes, getCollars } = useServerDataContext()
  const { setShirtModels, getShirtModel, getShirtModels, getIdModel, filesUpload, setFilesUpload } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage>()
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);
  const [formContext, setFormContent] = useState<FormContent | null>(null);

  async function getData() {
    setLoading(true)
    try {
      const dados = await getShirtTypes() as Option []
      const dados2 = await getCollars() as Option []
      if(dados){
        setDataPage({
          collars: dados2,
          shirtTypes: dados
        })
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
    if(!dataPage) getData();
    if(!formContext) getFormContent()
  }, [dataPage, formContext])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget as HTMLFormElement;

     //validação com zode
     const dados = validarDados(novaCamisaValidator, {
      printName:      form.printName.value, 
      shirtModeling:     form.shirtModeling.value,
      cuffStyle: form.cuffStyle.value,
      printingColors: form.printingColors.value,
      printingPositions: form.printingPositions.value,
      printingTechnique: form.printingTechnique.value,
      sleeveColor: form.sleeveColor.value,
      specialElement: form.specialElement.value,
      sizeAdjustment: form.sizeAdjustment.value
    }) as ReturnValidator;
    
    if(!dados.success){
      setLoading(false)
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as any
      setFormErrors({} as ZodIssue[])
      // próxima página
      const current = getShirtModel(params.id)

      const newModel = {
        printName: form.printName.value,
        shirtModeling: form.shirtModeling.value,
        namePhotoModel: '',
        shirtStyles: current.shirtStyles,
        defaultStyle: {
          shirtCollar: form.shirtCollar.value,
          printingTechnique: data.printingTechnique,
          printingColors: data.printingColors,
          printingPositions: data.printingPositions,
          sleeveColor: data.sleeveColor,
          cuffStyle: data.cuffStyle,
          specialElement: data.specialElement,
          sizeAdjustment: data.sizeAdjustment
        },
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

      <form method='post' onSubmit={handleSubmit} style={{marginBottom: '40px'}}>
        <h2 className={styles.title}>Informações do produto</h2>
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
          options={dataPage? dataPage.shirtTypes : []}
          errors={formErrors} 
        />

        <InputFile label='Layout do Modelo' id='arquivo'></InputFile>
        
        <Divider></Divider>
        <h2 className={styles.title}>Detalhamento Padrão</h2>

        <InputSelect 
          label='Gola' 
          name='shirtCollar' 
          id='shirtCollar'
          required 
          options={dataPage? dataPage.collars : []}
          errors={formErrors} 
        />
        <InputText type='text' label='Técnica de impressão' defaultValue='Silk Screen' required id='printingTechnique' name='printingTechnique' errors={formErrors}/>
        <InputText type='text' label='Cores Estampa' placeholder='Azul / Vermelho / Diversos' required id='printingColors' name='printingColors' errors={formErrors}/>
        <InputText type='text' label='Posições da Estampa' placeholder='Nuca / Peito Esq' required id='printingPositions' name='printingPositions' errors={formErrors}/>

        <Divider></Divider>
        
        <InputText type='text' label='Cor das Mangas' id='sleeveColor' name='sleeveColor' errors={formErrors}/>
        <InputText type='text' label='Punho' id='cuffStyle' name='cuffStyle' errors={formErrors}/>
        <InputText type='text' label='Elemento Especial' id='specialElement' name='specialElement' errors={formErrors}/>
        <InputText type='text' label='Ajuste de tamanho' id='sizeAdjustment' name='sizeAdjustment' errors={formErrors}/>

        <Button type='submit'>Próximo</Button>
      </form>
    </>
  )
}