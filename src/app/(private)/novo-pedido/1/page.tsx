'use client'
import styles from './page.module.css'
import ItemModelo from '@/components/ItemModelo'
import Header from '@/components/Header'
import { BtnLogoutHeader, IconBusca, IconHome, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import router from '@/api/rotas'
import toast from 'react-hot-toast'
import LoadingScreen from '@/components/LoadingScreen'
import Button from '@/components/Button'
import InputText from '@/components/Input/InputText'
import InputRadioGroup from '@/components/Input/RadioGroup'
import { Option } from '@/components/Input/interfaceInput'

export default function NovoPedido() {
  const { accessToken, username, logout, getToken } = useAuth();
  const [isLoading, setLoading] = useState(false)
  const [usernameLabel, setUsernameLabel] = useState("-----");

//   isso aqui é uma requisição para api
  const opcoesRadio: Option[] = [
    { id: 1, valor: 'University Shop' },
    { id: 2, valor: 'Green Factory' },
  ];


  useEffect(() => {
    if (!accessToken) window.location.href = '/';
    if(username) setUsernameLabel(username)
  }, [accessToken]);

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
            <Header.BtnReturn/>
            <Header.Title>Novo pedido</Header.Title>  
        </Header.Root>

        <form method='post'>
      
            <InputText type='text' label='Nome do pedido' name='nomePedido' autoFocus required/>

            <InputText type='text' label='Cliente Mediador' name='nomeCliente' />
            
            <InputText type='text' label='Whatsapp/Telefone' name='telefoneCLiente' />

            <InputRadioGroup label='Empresa Responsável' options={opcoesRadio}/>

            <div className={styles.rodape}>
              <div>
                <Button type='submit'>Próximo</Button>
              </div>
            </div>
        </form>
      </div>
      {isLoading && <LoadingScreen/>}
    </main>
  )
}