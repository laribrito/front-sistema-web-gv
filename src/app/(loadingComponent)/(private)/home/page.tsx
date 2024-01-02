'use client'
import styles from '@/app/(loadingComponent)/(private)/main.module.css'
import Header from '@/components/Header'
import { BtnLogoutHeader, IconBusca, IconHomeActive, IconNovoPedido, IconRelatorios } from "@/utils/elements"
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import apiRouter from '@/api/rotas'
import toast from 'react-hot-toast'
import ItemNegociacao, {DataItemNegotiation} from '@/components/ItemNegociacao'
import ItemNegociacaoStatus from '@/components/ItemNegociacao/itemNegociacaoStatus'
import Box from '@/components/Box'
import config from '@/utils/config'
import { DataOrderResponse, DataOrderResponseWithTexts, ShirtDetails, ShirtModel, ShirtPrice, ShirtStyle, useOrderContext } from '@/context/orderContext'
import { useComponentsContext } from '@/context/componentsContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  type DataStatus = {
    status_id: number
    name: string
  }

  const processNegotiationsWithStatus = (statusData: DataStatus[], negotiationsData: DataOrderResponse[]): DataOrderResponseWithTexts[] => {
    const newNegs = [] as DataOrderResponseWithTexts[]

    negotiationsData.map(negotiation => {
      const matchingStatus = statusData.find(status => status.status_id === negotiation.status);
      if (matchingStatus) {
        newNegs.push({
          ...negotiation,
          statusName: matchingStatus.name as string,
        })
      }
    });
    return newNegs;
  };

  const router = useRouter()
  const { username, logout, getToken } = useAuth();
  const { setOrderInfos, setShirtModels, setPrices, setCurrentOrderId } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const [usernameLabel, setUsernameLabel] = useState<string | null>(null);
  const [dataPage, setDataPage] = useState<DataOrderResponseWithTexts[] | null>(null)

  // pega os status e as negociações
  async function getStatusAndNegotiations() {
    setLoading(true)
    try {
      const [statusResponse, negotiationsResponse] = await Promise.all([
        axios.get(apiRouter.statuses, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
          },
        }),
        axios.get(apiRouter.negotiations, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
          },
        }),
      ]);
  
      const responseS = statusResponse.data;
      const responseN = negotiationsResponse.data;

      // Processar as respostas do servidor
      if (responseS.errors) {
        toast.error(responseS.errors);
      } else if (responseN.errors) {
        toast.error(responseN.errors);
      } else {
        // Faça o que você precisa fazer com negotiationsData
        const newData = processNegotiationsWithStatus(responseS.data, responseN.data);
        setDataPage(newData)
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Atualize a página');
    }

    setLoading(false)
  }
 
  useEffect(() => {
    if(!dataPage) getStatusAndNegotiations();
    if(username) setUsernameLabel(username)
  }, [username])

  function handleNeg(data: DataOrderResponseWithTexts){
    setCurrentOrderId(data.negotiation_id)
    setOrderInfos({
      classificacao: data.classification,
      empresa: data.company,
      nomeCliente: data.customer_name,
      nomePedido: data.name,
      status: data.status,
      telefoneCliente: data.customer_phone
    })

    const details = JSON.parse(data.details)

    const allShirts = details.shirts as ShirtDetails[]
    const shirtPrices = [] as ShirtPrice[]
    const shirtModels = [] as ShirtModel[]
    if(allShirts){
      allShirts.forEach((shirt)=>{
        shirtPrices.push({
          descUnit: shirt.unitDiscount,
          precoUnit: shirt.unitPrice
        })

        const shirtStyles = shirt.shirtStyles as ShirtStyle[]
        const newShirtStyles = [] as ShirtStyle[]

        shirtStyles.forEach((style)=>{
          newShirtStyles.push({
            ...style,
            toSave: true
          })
        })

        shirtModels.push({
          number_units: shirt.numberUnits,
          printName: shirt.printName,
          shirtModeling: shirt.shirtType,
          shirtStyles: newShirtStyles as ShirtStyle[],
          namePhotoModel: (shirt.imageUrl && shirt.imageUrl.length)? shirt.imageUrl: undefined
        })
      })
    }

    setPrices({
      order:{
        discount: data.discount_value,
        shipping: (data.shipping_cost)? data.shipping_cost : 0,
        subtotal: data.subtotal_value
      },
      shirts: shirtPrices
    })
    setShirtModels(shirtModels)

    setLoading(true)
    router.push('/pedido/produtos')
  }

  //processa logout
  async function handleLogout(){
    try {
      const response = await axios.delete(apiRouter.auth.logout, {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': getToken(),
        },
      });
    
      // Processar a resposta do servidor
      const data = response.data;
      if(data.errors){
        toast.error(data.errors)
      } else {
        //retira o token de acesso
        logout()
      }
    } catch (error) {
      toast.error('Ocorreu algum erro. Tente novamente')
    }
  }

  return (
    <>
      <Header.Root>
        <Header.Title>Dashboard</Header.Title>  
        <Header.Subtitle>Olá, {!usernameLabel && "-----"}{usernameLabel}</Header.Subtitle>  
        <Header.BtnExtra icon={BtnLogoutHeader} onClick={handleLogout}/>
      </Header.Root>

        <h1 className={styles.titulo}>Negociações recentes</h1>

        { dataPage === null ? (
          <>
            <Box fixWidth={config.WIDTH_WIDGETS} />
            <Box fixWidth={config.WIDTH_WIDGETS} />
            <Box fixWidth={config.WIDTH_WIDGETS} />
          </>
          ) : dataPage.length === 0 ? (
          <span className='discreto'>Não há negociações ainda...</span>
          ) : (
            <div style={{marginBottom: '80px'}}>
              {
                dataPage.map((negotiation, index) => (
                  <ItemNegociacao 
                    key={index} 
                    customer_name={negotiation.customer_name} 
                    name={negotiation.name} 
                    total_number_units={negotiation.total_number_units}
                    onClick={()=>{
                      handleNeg(negotiation)
                    }}
                  >
                    <ItemNegociacaoStatus value={negotiation.statusName}/>
                  </ItemNegociacao>
                ))
              }
            </div>
        )
        }

      <Navbar.Root>
        <Navbar.Item icon={IconRelatorios}>Análises</Navbar.Item>
        <Navbar.Item icon={IconHomeActive} active>Home</Navbar.Item>
        <Navbar.Item icon={IconBusca}>Busca</Navbar.Item>
        <Navbar.Item icon={IconNovoPedido}>Novo<br/>Pedido</Navbar.Item>
      </Navbar.Root>
    </>
  )
}