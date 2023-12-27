'use client'
import stylesPage from './page.module.css'
import Header from '@/components/Header'
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
import { useRouter } from 'next/navigation'
import { useComponentsContext } from '@/context/componentsContext'

export default function EditarInfoPedido() {
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

  type FormContent = {
    customerName: string
    orderName: string
    status: string
    customerPhone: string
    class: string
    company: string
  }

  const router = useRouter()
  const { setOrderInfos, getOrderInfos } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const { getClassifications, getCompanies, getStatus } = useServerDataContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null);
  const [infosOrder, setInfosOrder] = useState<FormContent | null> (null)
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);

  async function getData() {
    setLoading(true)
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
    setLoading(false)
  }

  function getInfosOrder(){
    const infos = getOrderInfos()
    setInfosOrder({
        customerName: infos.nomeCliente,
        customerPhone: infos.telefoneCliente,
        class: infos.classificacao.toString(),
        company: infos.empresa.toString(),
        orderName: infos.nomePedido,
        status: infos.status.toString()
    })
  }
 
  useEffect(() => {
    if(!dataPage) getData()
    if(!infosOrder) getInfosOrder()
  }, [dataPage, infosOrder])

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
    setLoading(true)

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
      setLoading(false)
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

      router.push("/novo-pedido/produtos")
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Editar Negociação</Header.Title>  
      </Header.Root>
      <form method='post' onSubmit={handleSubmit}>
          <InputText 
            type='text' 
            label='Nome do pedido' 
            name='nomePedido' 
            id='nomePedido'
            defaultValue={infosOrder?.orderName}
            autoFocus 
            required 
            errors={formErrors}
          />

          <InputText 
            type='text' 
            label='Cliente Mediador' 
            name='nomeCliente' 
            defaultValue={infosOrder?.customerName}
            id='nomeCliente'
            required 
            errors={formErrors}
          />
          
          <InputText 
            type='text' 
            label='Whatsapp/Telefone'
            id='telefoneCliente'
            name='telefoneCliente' 
            defaultValue={infosOrder?.customerPhone}
            required 
            errors={formErrors}
          />

          <InputRadioGroup 
            label='Empresa Responsável' 
            defaultValue={infosOrder?.company} 
            name='empresa' 
            options={dataPage && dataPage.company}
          />

          <div className={stylesPage.divForm}>
            <div className={stylesPage.divFormChild}>
              <InputSelect 
                label='Status' 
                name='status' 
                id='statusPedido' 
                options={dataPage && dataPage.classif} 
                defaultValue={infosOrder?.status}
              />
            </div>

            <div className={stylesPage.divFormChild}>
              <InputSelect 
                label='Classificação' 
                id='classifPedido' 
                name='classificacao' 
                options={dataPage && dataPage.status} 
                defaultValue={infosOrder?.class}
              />
            </div>
          </div>

          <Button type='submit'>Próximo</Button>
      </form>
    </>
  )
}