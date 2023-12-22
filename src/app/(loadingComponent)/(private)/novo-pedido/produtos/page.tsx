'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader,IconNovaCamisa } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(loadingComponent)/(private)/main.module.css'
import ItemModelo from '@/components/ItemModelo'
import { useComponentsContext } from '@/context/componentsContext'

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
    shirts: Shirt[]
    haveProducts: boolean
  }

  const { getOrderInfos, getShirtModels, setShirtModels } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const { getCompanies, getClassifications, getShirtTypes, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<DataHeader>({classificacao: '--', nomeCliente: '--', nomePedido: '--', empresa: '---'})
  const [products, setProducts] = useState<Products|null>(null)

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
      }
    });

    setShirtModels(approvedShirts)

    setProducts({
      shirts: shirts,
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
          <Header.BtnReturn/>
          <Header.Title>{dadosHeader?.nomePedido}</Header.Title>
          <Header.Subtitle>{dadosHeader?.nomeCliente}</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader}/>
      </Header.Root>

      <div className={styles.grid}>
        <h1>{dadosHeader?.empresa}</h1>
        <h2>{dadosHeader.classificacao}</h2>
      </div>

      {(products && products.haveProducts)? 
        <div style={{marginTop: '20px'}}>
          {products.shirts.map((shirt, index) => (
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
              <span className={mainStyles.labelDiscreto}>Cadastre modelos</span>
            </div>
            :
            <div>
              -------<br></br>
              -------
            </div>
      }

      

      <Navbar.Root>
        <Navbar.Item icon={IconNovaCamisa}>Nova Camisa</Navbar.Item>
      </Navbar.Root>
    </>
  )
}