'use client'
import styles from './page.module.css'
import ItemModelo from '@/components/ItemModelo'
import BotaoLateral from '@/components/BotaoLateral'
import Label from '@/components/Label'
import Box from '@/components/Box'
import ItemCombinacao from '@/components/ItemCombinacao'
import ItemCombinacaoIndicators from '@/components/ItemCombinacao/ItemCombinacaoIndicators'
import Button from '@/components/Button'
import ItemNegociacao from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import ItemAndDescription from '@/components/ItemAndDescription'
import FormField from "@/components/FormField/index"

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
        <Label tipo="titulo1" valor="Olá mundo"/>
        <Label tipo="titulo2" valor="Olá mundo"/>
        <Label tipo="titulo3" valor="Olá mundo"/>
        <Label tipo="label" valor="Olá mundo"/>
        <Label tipo="texto" valor="Olá mundo"/>
        <Label tipo="label discreto" valor="Olá mundo"/>
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

        <FormField.Root required>
            <FormField.Label valor='Nome da estampa' />
            <FormField.InputText type='text'/>
        </FormField.Root>

        <FormField.Root>
            <FormField.Label valor='Nome da estampa' />
            <FormField.InputSelect options={opcoes}/>
        </FormField.Root>

        <Button value='Próximo'/>
      </div>
    </main>
  )
}
