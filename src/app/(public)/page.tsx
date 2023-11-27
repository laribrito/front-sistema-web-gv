'use client'
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material'
import styles from './page.module.css'
import InputText from '@/components/Input/InputText'
import Button from '@/components/Button'

export default function Login() {
  return (
    <main className={styles.mainLogin}>
      <h1 style={{margin: "2em", textTransform: "uppercase"}}>Sistema Greenville</h1>
      <FormControl className={styles.formRoot}>
      
        <InputText type='text' label='Login'/>

        <InputText type='password' label='Senha'/>

        <Button type='submit'>Entrar</Button>
      </FormControl>
    </main>
  )
}
