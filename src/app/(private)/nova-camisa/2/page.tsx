'use client'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
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

export default function NovaCamisa2() {
  const { getShirtTypes } = useServerDataContext()
  const { setShirtModels, getShirtModels } = useOrderContext()
  const [dataPage, setDataPage] = useState<Option[]>([])
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);

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

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();

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

      const currentModels = getShirtModels()
      const modelExists = currentModels.find(
        (model:ShirtModel) => model.printName.trim() == newModel.printName.trim() && 
        model.shirtModeling == newModel.shirtModeling);

      if (!modelExists) currentModels.push(newModel)

      setShirtModels(currentModels)

      // window.location.href="/novo-pedido/produtos"
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Nova Camisa</Header.Title>
      </Header.Root>

    </>
  )
}