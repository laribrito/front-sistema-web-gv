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
import ItemNegociacao from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'

export default function Home() {
  const { accessToken, username, logout, getToken } = useAuth();
  const [isLoading, setLoading] = useState(false)
  const [usernameLabel, setUsernameLabel] = useState("-----");

  // coleta informações do 
  useEffect(() => {
    if (!accessToken) window.location.href = '/';
    if(username) setUsernameLabel(username)
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) window.location.href = '/';
    if(username) setUsernameLabel(username)
  }, [accessToken]);

  async function handleLogout(){
    try {
        console.log(getToken())
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
        } 
        else{
          //retira o token de acesso
          logout()
        }
      } catch (error) {
        toast.error('Ocorreu algum erro. Tente novamente')
        setLoading(false)
      }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Header.Root>
          <Header.Title>Dashboard</Header.Title>  
          <Header.Subtitle>Olá, {usernameLabel}</Header.Subtitle>  
          <Header.BtnExtra icon={BtnLogoutHeader} onClick={handleLogout}/>
        </Header.Root>

        <h1 className={styles.titulo}>Negociações recentes</h1>

        {/* futuramente aqui será um get com useeffect */}
        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='cancelado'/>
        </ItemNegociacao>

        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='aprovado'/>
        </ItemNegociacao>

        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='emAndamento'/>
        </ItemNegociacao>

        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='aprovado'/>
        </ItemNegociacao>

        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='cancelado'/>
        </ItemNegociacao>

        <Navbar.Root>
          <Navbar.Item icon={IconRelatorios}>Análises</Navbar.Item>
          <Navbar.Item icon={IconHomeActive}><u>Home</u></Navbar.Item>
          <Navbar.Item icon={IconBusca}>Busca</Navbar.Item>
          <Navbar.Item icon={IconNovoPedido}>Novo<br/>Pedido</Navbar.Item>
        </Navbar.Root>
      </div>
      {isLoading && <LoadingScreen/>}
    </main>
  )
}