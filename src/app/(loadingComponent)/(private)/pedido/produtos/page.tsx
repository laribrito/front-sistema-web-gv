'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader,IconCancel,IconItem,IconMoney,IconNovaCamisa } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(loadingComponent)/(private)/main.module.css'
import ItemModelo from '@/components/ItemModelo'
import { useComponentsContext } from '@/context/componentsContext'
import { useRouter } from 'next/navigation'
import ModalYesOrNo from '@/components/ModalYesOrNo/indext'
import BotaoLateral from '@/components/BotaoLateral'
import toast from 'react-hot-toast'
import { QtdUnidadesPorExtenso } from '@/utils/functions'

export default function DashboardProdutos() {
  type DataHeader={
    nomePedido: string
    nomeCliente: string
    empresa: string
    classificacao: string
  }

  type Shirt = {
    printName: string
    shirtModeling: string
    shirtModelingId: number
    numberUnits: number
    index: number
  }

  type Products={
    shirts: {
      prods: Shirt[]
      numberUnits: number
    }
    haveProducts: boolean
  }

  const router = useRouter()
  const { getOrderInfos, getShirtModels, setShirtModels } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const { getCompanies, getClassifications, getShirtTypes, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<DataHeader>({classificacao: '--', nomeCliente: '--', nomePedido: '--', empresa: '---'})
  const [products, setProducts] = useState<Products|null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(()=>{
    setLoading(false)
  }, [cancelModalOpen])

  async function getDataInfo() {
    setLoading(true)
    try {
      const pedidoInfo = getOrderInfos() as OrderInfos

      const companiesData = await getCompanies();
      const empresa = (companiesData)? parseOptionName(companiesData, pedidoInfo.empresa):''

      const classifData = await getClassifications();
      const classif = (classifData)? parseOptionName(classifData, pedidoInfo.classificacao):''

      setDadosHeader({
        nomePedido: pedidoInfo.nomePedido,
        nomeCliente: pedidoInfo.nomeCliente,
        empresa: empresa,
        classificacao: classif
      } as DataHeader); // Se companiesData for null, define um array vazio
    } catch (error) {
      console.error('Erro ao obter empresas:', error);
      // Trate o erro conforme necessário
    }
    setLoading(false)
  }

  async function getProducts() {
    setLoading(true)
    var haveProducts = false

    const allShirts = getShirtModels()
    const approvedShirts = [] as ShirtModel[]
    const shirts = [] as Shirt[]
    const allModeling = await getShirtTypes()
    var unitsShirts = 0

    var id = 0
    allShirts.forEach((shirt, index) => {
      haveProducts = true
      if(shirt.number_units!=0 && allModeling) {
        approvedShirts.push(shirt)

        const modelingName = parseOptionName(allModeling, shirt.shirtModeling)

        shirts.push({
          printName: shirt.printName,
          shirtModelingId: shirt.shirtModeling,
          shirtModeling: (modelingName)? modelingName : '',
          numberUnits: shirt.number_units,
          index: id++
        })

        unitsShirts += shirt.number_units
      }
    });

    setShirtModels(approvedShirts)

    setProducts({
      shirts: {
        prods: shirts,
        numberUnits: unitsShirts
      },
      haveProducts: haveProducts
    })
    setLoading(false)
  }

  useEffect(() => {
    if(dadosHeader.classificacao == '--') getDataInfo();
    if(!products) getProducts()
  }, [products, dadosHeader]);

  return (
    <>
      <Header.Root>
          <Header.Title>{dadosHeader?.nomePedido}</Header.Title>
          <Header.Subtitle>{dadosHeader?.nomeCliente}</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader} onClick={()=>{
            setLoading(true)
            router.push('/pedido/edit')
          }}/>
      </Header.Root>

      <ModalYesOrNo 
            open={cancelModalOpen}
            question={`Tem certeza que deseja excluir esse pedido?`}
            onConfirm={()=>{
              setLoading(true)
              router.push('/home')
            }}
            onClose={()=>{setCancelModalOpen(false)}}
      />

      <BotaoLateral tipo='EXCLUIR' onClick={()=>{setCancelModalOpen(true)}}></BotaoLateral>

      <div className={styles.grid}>
        <h1>{dadosHeader?.empresa}</h1>
        <h2>{dadosHeader.classificacao}</h2>
      </div>

      {(products && products.haveProducts)? 
        <div style={{marginTop: '20px'}}>
          {products.shirts.numberUnits!=0 &&
          <div className={styles.grid} style={{margin: '0'}}>
            <h2><IconItem /> Camisas</h2>
            <h3 style={{fontWeight: 'normal'}}>{QtdUnidadesPorExtenso(products.shirts.numberUnits)}</h3>
          </div>
          }
          {products.shirts.prods.map((shirt, index) => (
            <ItemModelo 
              key={index} 
              nomeModelo={shirt.printName} 
              tipoCamisa={shirt.shirtModeling} 
              qtdCamisas={shirt.numberUnits} 
              url={`/camisa/${shirt.index}/`}
            />
          ))}
        </div>
        : (products && !products.haveProducts)?
            <div className={styles.spanBox}>
              <span className={mainStyles.labelDiscreto}>Cadastre produtos no pedido</span>
            </div>
            :
            <div>
              -------<br></br>
              -------
            </div>
      }

      <Navbar.Root>
        {(products && products.haveProducts) &&
          <Navbar.Item icon={IconMoney} onClick={()=>{
            setLoading(true)
            router.push('/pedido/financeiro')
          }}>Seguir para<br/> o financeiro</Navbar.Item>
        }
        <Navbar.Item icon={IconNovaCamisa}>Nova Camisa</Navbar.Item>
      </Navbar.Root>
    </>
  )
}