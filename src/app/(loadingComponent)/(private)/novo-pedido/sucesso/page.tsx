'use client'
import { useOrderContext } from '@/context/orderContext'
import { IconSucess } from '@/utils/elements'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Button from '@/components/Button'
import { useComponentsContext } from '@/context/componentsContext'

export default function FinanceiroPedido() {
  const router = useRouter()
  const { setLoading } = useComponentsContext()
  const { fileDownload } = useOrderContext()

  return (
    <>
        <IconSucess style={{backgroundColor: '#1DBA5C', fontSize: '150px', padding: '30px', border: 'solid 5px #DAEECA', borderRadius: '50%', color: 'white'}} />
        <h1 className={styles.title}>Pedido resgistrado<br/>com sucesso!</h1>
        <Button style={{marginTop: '30px'}}>Baixar Documento</Button>
        <Button style={{marginTop: '20px'}} onClick={()=>{
            setLoading(true)
            router.push('/home')
        }}>Home</Button>
    </>
  )
}