'use client'
import styles from '@/app/(private)/main.module.css'
import Header from '@/components/Header'
import { BtnLogoutHeader, IconBusca, IconHomeActive, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import apiRouter from '@/api/rotas'
import toast from 'react-hot-toast'
import ItemNegociacao, {DataItemNegotiation} from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import Box from '@/components/Box'
import config from '@/utils/config'
import { useOrderContext } from '@/context/orderContext'

export default function Home() {
  type DataStatus = {
    status_id: number
    name: string
  }

  const processNegotiationsWithStatus = (statusData: DataStatus[], negotiationsData: DataItemNegotiation[]): DataItemNegotiation[] => {
    const processedNegotiations = negotiationsData.map(negotiation => {
      const matchingStatus = statusData.find(status => status.status_id === negotiation.status);
      if (matchingStatus) {
        return {
          ...negotiation,
          status: matchingStatus.name,
        };
      }
      return negotiation;
    });
    return processedNegotiations;
  };

  const { username, logout, getToken } = useAuth();
  const { cleanOrdenContext } = useOrderContext()
  const [usernameLabel, setUsernameLabel] = useState<string | null>(null);
  const [dataPage, setDataPage] = useState<DataItemNegotiation[] | null>(null)

  // pega os status e as negociações
  async function getStatusAndNegotiations() {
    try {
      const [statusResponse, negotiationsResponse] = await Promise.all([
        axios.get(apiRouter.statuses, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
          },
        }),
        axios.get(apiRouter.negotiations, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
          },
        }),
      ]);
  
      const responseS = statusResponse.data;
      const responseN = negotiationsResponse.data;

      // Processar as respostas do servidor
      if (responseS.errors) {
        toast.error(responseS.errors);
      } else if (responseN.errors) {
        toast.error(responseN.errors);
      } else {
        // Faça o que você precisa fazer com negotiationsData
        const newData = processNegotiationsWithStatus(responseS.data, responseN.data);
        setDataPage(newData)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }
  }
 
  useEffect(() => {
    if(!dataPage) getStatusAndNegotiations();
    if(username) setUsernameLabel(username)
    cleanOrdenContext()
  }, [username])

  //processa logout
  async function handleLogout(){
    try {
      const response = await axios.delete(apiRouter.auth.logout, {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': getToken(),
        },
      });
    
      // Processar a resposta do servidor
      const data = response.data;
      if(data.errors){
        toast.error(data.errors)
      } else {
        //retira o token de acesso
        logout()
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente')
    }
  }

  return (
    <>
      <Header.Root>
        <Header.Title>Dashboard</Header.Title>  
        <Header.Subtitle>Olá, {!usernameLabel && "-----"}{usernameLabel}</Header.Subtitle>  
        <Header.BtnExtra icon={BtnLogoutHeader} onClick={handleLogout}/>
      </Header.Root>

        <h1 className={styles.titulo}>Negociações recentes</h1>

        { dataPage === null ? (
          <>
            <Box width={config.WIDTH_WIDGETS} />
            <Box width={config.WIDTH_WIDGETS} />
            <Box width={config.WIDTH_WIDGETS} />
          </>
          ) : dataPage.length === 0 ? (
          <span className='discreto'>Não há negociações ainda...</span>
          ) : (
          /* Render your data here, assuming dataNegotiations is an array */
          dataPage.map((negotiation, index) => (
            <ItemNegociacao key={index} customer_name={negotiation.customer_name} name={negotiation.name} total_number_units={negotiation.total_number_units}>
              <ItemNegociacaoStatus value={negotiation.status}/>
            </ItemNegociacao>
          ))
        )
        }

      <Navbar.Root>
        <Navbar.Item icon={IconRelatorios}>Análises</Navbar.Item>
        <Navbar.Item icon={IconHomeActive} active>Home</Navbar.Item>
        <Navbar.Item icon={IconBusca}>Busca</Navbar.Item>
        <Navbar.Item icon={IconNovoPedido}>Novo<br/>Pedido</Navbar.Item>
      </Navbar.Root>
    </>
  )
}