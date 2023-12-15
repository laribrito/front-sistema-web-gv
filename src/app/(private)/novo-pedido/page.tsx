'use client'
import styles from '@/app/(private)/main.module.css'
import stylesPage from './page.module.css'
import Header from '@/components/Header'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/Button'
import InputText from '@/components/Input/InputText'
import InputRadioGroup from '@/components/Input/RadioGroup'
import { Option } from '@/components/Input/interfaceInput'
import InputSelect from '@/components/Input/InputSelect'
import { NewOrder1Validator } from '@/zod/validators'
import { validarDados, ReturnValidator } from '@/zod/parseValidation'
import { ZodIssue } from 'zod'
import { useOrderContext, OrderInfos } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'

export default function NovoPedido() {
  type DataPage= {
    status: Option[],
    company: Option[],
    classif: Option[]
  }

  function processesData(statusData: Option[], companiesData: Option[], classifData: Option[]): DataPage {
    const dataPage = {
      status: statusData,
      company: companiesData,
      classif: classifData
    }
  
    return dataPage;
  }

  const { setOrderInfos } = useOrderContext()
  const { getClassifications, getCompanies, getStatus } = useServerDataContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null);
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);

  async function getData() {
    try {
      const [companiesResponse, classifResponse, statusResponse] = await Promise.all([
        getClassifications(),
        getCompanies(),
        getStatus(),
      ]);

      if(companiesResponse && classifResponse && statusResponse){
        const newData = processesData(companiesResponse, classifResponse, statusResponse);
        setDataPage(newData)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }
 
  useEffect(() => {
    if(!dataPage) getData();
  }, [])

  // form submit
  type FormData = {
    nomePedido: string
    nomeCliente: string
    telefoneCliente: string
    empresa: number
    classificacao: number
    status: number
  }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //validação com zode
    const dados = validarDados(NewOrder1Validator, {
      nomePedido:      form.nomePedido.value, 
      nomeCliente:     form.nomeCliente.value,
      telefoneCliente: form.telefoneCliente.value,
      empresa:         form.empresa.value,
      classificacao:   form.classificacao.value,
      status:          form.status.value
    }) as ReturnValidator;

    if(!dados.success){
      setFormErrors(dados.data as ZodIssue[])
      setTimeout(() => {
        setFormErrors({} as ZodIssue[]);
      }, 4000);
    } else {
      const data = dados.data as OrderInfos
      setFormErrors({} as ZodIssue[])
      // próxima página

      setOrderInfos({
        nomePedido: data.nomePedido,
        nomeCliente: data.nomeCliente,
        telefoneCliente: data.telefoneCliente,
        empresa: data.empresa,
        classificacao: data.classificacao,
        status: data.status
      })

      window.location.href="/novo-pedido/produtos"
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Novo pedido</Header.Title>  
      </Header.Root>
      <form method='post' onSubmit={handleSubmit}>
          <InputText 
            type='text' 
            label='Nome do pedido' 
            name='nomePedido' 
            id='nomePedido'
            autoFocus 
            required 
            errors={formErrors}
          />

          <InputText 
            type='text' 
            label='Cliente Mediador' 
            name='nomeCliente' 
            id='nomeCliente'
            required 
            errors={formErrors}
          />
          
          <InputText 
            type='text' 
            label='Whatsapp/Telefone'
            id='telefoneCliente'
            name='telefoneCliente' 
            required 
            errors={formErrors}
          />

          <InputRadioGroup label='Empresa Responsável' name='empresa' options={dataPage && dataPage.company}/>

          <div className={stylesPage.divForm}>
            <div className={stylesPage.divFormChild}>
              <InputSelect label='Classificação' name='classificacao' id='classifPedido' options={dataPage && dataPage.classif} />
            </div>

            <div className={stylesPage.divFormChild}>
              <InputSelect label='Status' id='statusPedido' name='status' options={dataPage && dataPage.status} />
            </div>
          </div>

          <Button type='submit'>Próximo</Button>
      </form>
    </>
  )
}