'use client'
import styles from '@/app/(private)/main.module.css'
import stylesPage from './page.module.css'
import Header from '@/components/Header'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import router from '@/api/rotas'
import toast from 'react-hot-toast'
import Button from '@/components/Button'
import InputText from '@/components/Input/InputText'
import InputRadioGroup from '@/components/Input/RadioGroup'
import { Option } from '@/components/Input/interfaceInput'
import InputSelect from '@/components/Input/InputSelect'
import { NewOrder1Validator } from '@/zod/validators'
import { validarDados, ReturnValidator } from '@/zod/parseValidation'
import { ZodIssue } from 'zod'
import { useOrderContext, OrderDetails } from '@/context/orderContext'

export default function NovoPedido() {
  type CompanyData = {
    company_id: number
    name: string
  }

  type ClassifData = {
    classification_id: number
    name: string
  }

  type StatusData = {
    status_id: number
    name: string
  }

  type DataPage= {
    status: Option[],
    company: Option[],
    classif: Option[]
  }

  function processesData(statusData: StatusData[], companiesData: CompanyData[], classifData: ClassifData[]): DataPage {
    // Transforma cada objeto DataResponse em um objeto Option
    const status: Option[] = statusData.map((dataPage) => ({
      id: dataPage.status_id,
      valor: dataPage.name,
    }));

    const company: Option[] = companiesData.map((dataPage) => ({
      id: dataPage.company_id,
      valor: dataPage.name,
    }));

    const classif: Option[] = classifData.map((dataPage) => ({
      id: dataPage.classification_id,
      valor: dataPage.name,
    }));

    const dataPage = {
      status: status,
      company: company,
      classif: classif
    }
  
    return dataPage;
  }

  const { accessToken, getToken } = useAuth();
  const {currentOrder, setOrder } = useOrderContext()
  const [dataPage, setDataPage] = useState<DataPage | null>(null);
  const [formErrors, setFormErrors] = useState<ZodIssue[]>({} as ZodIssue[]);

  async function getData() {
    try {
      const [companiesResponse, classifResponse, statusResponse] = await Promise.all([
        axios.get(router.API_ROOT + router.company, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        }),
        axios.get(router.API_ROOT + router.classification, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        }),
        axios.get(router.API_ROOT + router.status, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': router.PREFIX_TOKEN + getToken(),
          },
        }),
      ]);
  
      const responseS = statusResponse.data;
      const responseCo = companiesResponse.data;
      const responseCa = classifResponse.data;

      // Processar as respostas do servidor
      if (responseS.errors) {
        toast.error(responseS.errors);
      } else if (responseCo.errors) {
        toast.error(responseCo.errors);
      } else if (responseCa.errors) {
          toast.error(responseCa.errors);
      } else {
        // Faça o que você precisa fazer com negotiationsData
        const newData = processesData(responseS.data, responseCo.data, responseCa.data);
        setDataPage(newData)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }
 
  useEffect(() => {
    if(!dataPage) getData();
  }, [])

  //se não estiver logado, vai pra login
  useEffect(() => {
    if (!accessToken) window.location.href = '/';
  }, [accessToken]);

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
      const data = dados.data as OrderDetails
      setFormErrors({} as ZodIssue[])
      // próxima página

      setOrder({
        nomePedido: data.nomePedido,
        nomeCliente: data.nomeCliente,
        telefoneCliente: data.telefoneCliente,
        empresa: data.empresa,
        classificacao: data.classificacao,
        status: data.status
      })
    }
  }

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Novo pedido</Header.Title>  
      </Header.Root>
      <main className={styles.main}>
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

                <div className={styles.btnSubmitForm}>
                  <Button type='submit'>Próximo</Button>
                </div>
          </form>
      </main>
    </>
  )
}