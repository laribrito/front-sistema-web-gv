'use client'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import Button from '@/components/Button'
import { LoginValidator } from '@/zod/validators';
import { validarDados } from '@/zod/parseValidation'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import router from '@/api/rotas';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/context/authContext';

export default function Login() {
  const [isLoading, setLoading] = useState(false)

  type LoginCredentials = {
    username: string,
    password: string
  }

  const { accessToken, login, logout } = useAuth();
  
  useEffect(() => {
    console.log(accessToken)
    if (accessToken) window.location.href = '/teste';
  }, [accessToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //validação com zode
    const dados = validarDados(LoginValidator, {username: form.username.value, password: form.password.value}) as LoginCredentials;
    
    //envio dos dados pra api com axios
    if(dados)
    try {
      setLoading(true)
      const response = await axios.post(router.API_ROOT+router.auth.login, {
        username: dados.username,
        password: dados.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      // Processar a resposta do servidor, se necessário
      const data = response.data;
      if(data.errors){
        setLoading(false)
        toast.error(data.errors)
      } 
      else{
        //armazena o token de acesso
        login(data.token)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente')
      setLoading(false)
    }
  }

  return (
    <main className={styles.mainLogin}>
      <h1 style={{margin: "2em", textTransform: "uppercase"}}>Sistema Greenville</h1>
      <Toaster position="top-right" />
      <form className={styles.formRoot} onSubmit={handleLogin} method='post'>
      
        <InputText type='text' label='Login' name='username' autoFocus/>

        <InputText type='password' label='Senha' name='password' />

        <Button type='submit'>Entrar</Button>
      </form>

      {isLoading && <LoadingScreen/>}
    </main>
  )
}
