'use client'
import styles from './page.module.css'
import ItemModelo from '@/components/ItemModelo'
import Header from '@/components/Header'
import { BtnLogoutHeader, IconBusca, IconHomeActive, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import router from '@/api/rotas'
import toast from 'react-hot-toast'
import LoadingScreen from '@/components/LoadingScreen'
import ItemNegociacao, {DataItemNegotiation} from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import Box from '@/components/Box'
import config from '@/utils/config'

export default function Home() {
  const { accessToken, username, logout, getToken } = useAuth();
  const [isLoading, setLoading] = useState(false)
  const [usernameLabel, setUsernameLabel] = useState("-----");
  const [dataNegotiations, setData] = useState<DataItemNegotiation[] | null>(null)

  //pega todas as negociações
  async function getNegotiations(){
    try {
      const response = await axios.get(router.API_ROOT+router.negotiations, {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': router.PREFIX_TOKEN + getToken(),
        },
      });

      console.log("api")
    
      // Processar a resposta do servidor, se necessário
      const data = response.data;
      if(data.errors){
        toast.error(data.errors)
      } else {
        setData(data.data)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente')
    }
  }
 
  useEffect(() => {
    getNegotiations()
  }, [])

  console.log(dataNegotiations)

  //se não estiver logado, vai pra login
  useEffect(() => {
    if (!accessToken) window.location.href = '/';
    if(username) setUsernameLabel(username)
  }, [accessToken]);

  //processa logout
  async function handleLogout(){
    try {
      setLoading(true)
      const response = await axios.delete(router.API_ROOT+router.auth.logout, {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': router.PREFIX_TOKEN + getToken(),
        },
      });
    
      // Processar a resposta do servidor, se necessário
      const data = response.data;
      if(data.errors){
        setLoading(false)
        toast.error(data.errors)
      } else {
        //retira o token de acesso
        logout()
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente')
      setLoading(false)
    }
  }

  return (
    <>
      <Header.Root>
        <Header.Title>Dashboard</Header.Title>  
        <Header.Subtitle>Olá, {usernameLabel}</Header.Subtitle>  
        <Header.BtnExtra icon={BtnLogoutHeader} onClick={handleLogout}/>
      </Header.Root>

      <main className={styles.main}>
          <h1 className={styles.titulo}>Negociações recentes</h1>

          {dataNegotiations === null ? (
            <Box width={config.WIDTH_WIDGETS} />
          ) : dataNegotiations.length === 0 ? (
            <span>Não há negociações ainda...</span>
          ) : (
            /* Render your data here, assuming dataNegotiations is an array */
            dataNegotiations.map((negotiation, index) => (
              // Render your negotiation items here
              <div key={index}>{/* Your negotiation item JSX */}</div>
            ))
          )}

        {isLoading && <LoadingScreen/>}
      </main>
      <Navbar.Root>
        <Navbar.Item icon={IconRelatorios}>Análises</Navbar.Item>
        <Navbar.Item icon={IconHomeActive}><u>Home</u></Navbar.Item>
        <Navbar.Item icon={IconBusca}>Busca</Navbar.Item>
        <Navbar.Item icon={IconNovoPedido}>Novo<br/>Pedido</Navbar.Item>
      </Navbar.Root>
    </>
  )
}