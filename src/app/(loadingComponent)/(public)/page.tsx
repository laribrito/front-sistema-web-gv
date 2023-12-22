'use client'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import Button from '@/components/Button'
import { LoginValidator } from '@/zod/validators';
import { validarDados, ReturnValidator } from '@/zod/parseValidation'
import toast from 'react-hot-toast';
import axios from 'axios';
import apiRouter from '@/api/rotas';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useComponentsContext } from '@/context/componentsContext';

export default function Login() {
  const router = useRouter()
  const { setLoading } = useComponentsContext()

  type LoginCredentials = {
    username: string,
    password: string
  }

  const { accessToken, login } = useAuth();
  
  useEffect(() => {
    if (accessToken) router.push('/home');
  }, [accessToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //validação com zode
    const dados = validarDados(LoginValidator, {username: form.username.value, password: form.password.value}, true) as ReturnValidator;
    
    //envio dos dados pra api com axios
    if(dados.success)
    try {
      setLoading(true)
      const d = dados.data as LoginCredentials
      const response = await axios.post(
        apiRouter.auth.login,
        {
          username: d.username,
          password: d.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000, // Tempo limite em milissegundos (60 segundos neste exemplo)
        }
      )
      
      toast.success('buscando o erro')
      // Processar a resposta do servidor, se necessário
      const data = response.data;
      if(data.errors){
        setLoading(false)
        toast.error(data.errors)
      } 
      else{
        //armazena o token de acesso
        login(data.token, data.username)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente!!!')
      setLoading(false)
    }
  }

  return (
    <main className={styles.mainLogin}>
      <h1 style={{margin: "2em", textTransform: "uppercase"}}>Sistema Greenville</h1>
      <form className={styles.formRoot} onSubmit={handleLogin} method='post'>
      
        <InputText type='text' label='Login' name='username' autoFocus/>

        <InputText type='password' label='Senha' name='password' />

        <Button type='submit'>Entrar</Button>
      </form>
    </main>
  )
}
