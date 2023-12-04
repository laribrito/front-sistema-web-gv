'use client'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { LoginValidator } from '@/utils/validators'
import { useSelector } from 'react-redux'
import LoadingScreen from '@/components/LoadingScreen'
import { RootState } from '@/redux/store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import router from '@/api/rotas'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { loginUser } from '@/redux/userSlice'

type LoginCredentials = Zod.infer<typeof LoginValidator>

type loginResponse = {
  accessToken: string
}

export default function Login() {
  // const [isLoading, setLoading] = useState(false)

  const accessToken = useSelector(
    (state: RootState) => state.user.accessToken
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginValidator)
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) window.location.href = '/teste';
  }, [accessToken]);

  const { mutate: loginHandler, isLoading } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: LoginCredentials) => {
      try{
        const { data } = await axios.post(
          router.API_ROOT+router.auth.login,
          JSON.stringify({username, password})
        )

        return data as loginResponse
      } catch {
        toast.error('Erro ao realizar o login. Tente novamente mais tarde.');
  
        // Interrompe o fluxo de login, pois ocorreu um erro
        return {accessToken: ''} as loginResponse;
      }
    },
    onSuccess: (data) => {
      dispatch(
        loginUser({
          userName: getValues().username,
          accessToken: data.accessToken
        })
      );
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        toast.error('Não foi possível fazer login');
      } else {
        toast.error('Tente novamente');
      }
    }
  })

  return (
    <main className={styles.mainLogin}>
      <h1 style={{margin: "2em", textTransform: "uppercase"}}>Sistema Greenville</h1>

      <form className={styles.formRoot} onSubmit={handleSubmit((data) => loginHandler(data))} method='post'>
      
        <InputText type='text' label='Login' name="username" aria-label='nome de usuário' autoFocus/>

        <InputText type='password' label='Senha' name='password' aria-label='senha'/>

        <Button type='submit'>Entrar</Button>

        {/* {isLoading && <LoadingScreen/>} */}
      </form>
    </main>
  );
}
