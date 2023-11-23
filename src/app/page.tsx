'use client'
import styles from './page.module.css'
import ItemModelo from '@/components/ItemModelo'
import BotaoLateral from '@/components/BotaoLateral'
import ItemCombinacao from '@/components/ItemCombinacao'
import ItemCombinacaoIndicators from '@/components/ItemCombinacao/ItemCombinacaoIndicators'
import Button from '@/components/Button'
import ItemNegociacao from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import ItemAndDescription from '@/components/ItemAndDescription'
import InputText from '@/components/Input/InputText'

export default function Home() {
  const opcoes: Array<[number, string]> = [
    [1, "Opção 1"],
    [2, "Opção 2"],
    [3, "Opção 3"],
  ];

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
        <h1>Olá mundo</h1>
        <h2>Olá mundo</h2>
        <h3>Olá mundo</h3>
        <label htmlFor="">Olá mundo</label>
        <p>Olá mundo</p>
        <p className='labelDiscreto'>Olá mundo</p>
        <ItemCombinacao cor='Azul' malha='Algodão' qtdCamisas={3}>
          <ItemCombinacaoIndicators tipo='obs'/>
          <ItemCombinacaoIndicators tipo='anexo'/>
        </ItemCombinacao>
        <ItemCombinacao cor='Azul' malha='Algodão' qtdCamisas={3}/>
        <ItemCombinacao cor='Azul' malha='Algodão' qtdCamisas={3}>
          <ItemCombinacaoIndicators tipo='anexo'/>
        </ItemCombinacao>

        <ItemNegociacao nomeCliente='Larissa Brito' nomeNegociacao='Camisas CIC' qtdCamisas={40}>
          <ItemNegociacaoStatus value='cancelado'/>
        </ItemNegociacao>

        <ItemAndDescription item='Cor' description='Azul'></ItemAndDescription>
        <ItemAndDescription item='Cor' description='Azul' horizontal={true}></ItemAndDescription>

        <InputText type='text' label='Nome do modelo' />

        <Button value='Próximo'/>
      </div>
    </main>
  )
}
