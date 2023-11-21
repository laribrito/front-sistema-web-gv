'use client'
import styles from './page.module.css'
import ItemModelo from '@/components/ItemModelo'
import BotaoLateral from '@/components/BotaoLateral'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ItemModelo nomeModelo='UESC Original' tipoCamisa='Tradicional' qtdCamisas={3}/>
        <ItemModelo nomeModelo='UESC Original' tipoCamisa='Polo' qtdCamisas={1}/>
        <BotaoLateral tipo="EXCLUIR" onClick={()=> {console.log("Clicou")}}/>
        <ItemModelo nomeModelo='UESC Original' tipoCamisa='Polo' qtdCamisas={1}/>
        <ItemModelo nomeModelo='UESC Original' tipoCamisa='Tradicional' qtdCamisas={3} vertical={true} />
        <BotaoLateral tipo="IMAGEM APROVADA" onClick={()=> {console.log("Clicou")}}/>
        <ItemModelo nomeModelo='UESC Original' tipoCamisa='Tradicional' qtdCamisas={3} vertical={true} />
      </div>
    </main>
  )
}
