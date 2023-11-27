'use client'
import styles from '../page.module.css'
import ItemModelo from '@/components/ItemModelo'
import BotaoLateral from '@/components/BotaoLateral'
import ItemCombinacao from '@/components/ItemCombinacao'
import ItemCombinacaoIndicators from '@/components/ItemCombinacao/ItemCombinacaoIndicators'
import Button from '@/components/Button'
import ItemNegociacao from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import ItemAndDescription from '@/components/ItemAndDescription'
import InputText from '@/components/Input/InputText'
import InputSelect from '@/components/Input/InputSelect'
import InputFile from '@/components/Input/InputFile'
import InputRadioGroup from '@/components/Input/RadioGroup'
import { Option } from '@/components/Input/interfaceInput'
import Header from '@/components/Header'
import { BtnEdicaoHeader, IconBusca, IconHome, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'

export default function Teste() {
  const opcoesSelect: Option[] = [
    { id: 1, valor: 'Option 1' },
    { id: 2, valor: 'Option 2' },
    { id: 3, valor: 'Option 3' },
  ];

  const opcoesRadio: Option[] = [
    { id: 1, valor: 'University Shop' },
    { id: 2, valor: 'Green Factory' },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>Olá mundo</Header.Title>  
          <Header.Subtitle>Larissa</Header.Subtitle>  
          <Header.BtnExtra icon={BtnEdicaoHeader}/>
        </Header.Root>

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

        <InputText type='text' label='Nome do modelo' id='nomeModelo' />

        <InputSelect label='Nome do modelo' id='nomeModelo' options={opcoesSelect} />

        <InputFile label='Nome do modelo' id='nomeModelo' />

        <InputRadioGroup label='Empresa' options={opcoesRadio}/>

        <Button value='Próximo'/>

        <Navbar.Root>
          <Navbar.Item icon={IconRelatorios}>Análises</Navbar.Item>
          <Navbar.Item icon={IconHome}>Home</Navbar.Item>
          <Navbar.Item icon={IconBusca}>Busca</Navbar.Item>
          <Navbar.Item icon={IconNovoPedido}>Novo<br/>Pedido</Navbar.Item>
        </Navbar.Root>
      </div>
    </main>
  )
}