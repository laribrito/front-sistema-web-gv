'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { IconItem, IconSave } from "@/utils/elements"
import { useEffect, useRef, useState } from 'react'
import { DataOrderToSend, OrderInfos, Prices, ShirtDetails, ShirtModel, ShirtPrice, ShirtStyleDetails, SizeGrid, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(loadingComponent)/(private)/main.module.css'
import ItemModelo from '@/components/ItemModelo'
import { useComponentsContext } from '@/context/componentsContext'
import { useRouter } from 'next/navigation'
import { QtdUnidadesPorExtenso, getMonetaryNumber, getMonetaryString, setMonetaryNumber } from '@/utils/functions'
import InputText from '@/components/Input/InputText'
import toast from 'react-hot-toast'
import axios from 'axios'
import apiRouter from '@/api/rotas'
import { useAuth } from '@/context/authContext'

export default function FinanceiroPedido() {
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
    prices: Prices
    numberItens: number
  }

  type DataRecibo = {
    numberUnits: number
    discount: number
    subtotal: number
    shippingCost: number
  }

  const router = useRouter()
  const { getToken } = useAuth()
  const { getOrderInfos, getShirtModels, setShirtModels, setPrices, getPrices, setCurrentOrderId, getCurrentOrderId } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const { getCompanies, getClassifications, getShirtTypes, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<DataHeader>({classificacao: '--', nomeCliente: '--', nomePedido: '--', empresa: '---'})
  const [products, setProducts] = useState<Products|null>(null)
  const formRef = useRef<HTMLFormElement | null>(null);

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

    const allShirts = getShirtModels()
    const approvedShirts = [] as ShirtModel[]
    const shirts = [] as Shirt[]
    const allModeling = await getShirtTypes()
    const allPrices = getPrices()
    const allShirtPrices = allPrices?.shirts
    var unitsShirts = 0
    var totalPrice = 0
    var totalDiscount = 0
    var totalItens = 0

    var id = 0
    allShirts.forEach((shirt, index) => {
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

        
        totalPrice+= (allShirtPrices)? shirt.number_units * allShirtPrices[index].precoUnit : 0
        totalDiscount+= (allShirtPrices)? shirt.number_units * allShirtPrices[index].descUnit : 0
        totalItens+=shirt.number_units
      }
    });

    setShirtModels(approvedShirts)

    const thePrices = {
      order:{
        discount: totalDiscount,
        shipping: (allPrices)? allPrices.order.shipping : 0,
        subtotal: (allPrices)? totalPrice + allPrices.order.shipping : 0
      },
      shirts: (allShirtPrices)? allShirtPrices : []
    } as Prices

    setProducts({
      shirts: {
        prods: shirts,
        numberUnits: unitsShirts
      },
      prices: thePrices,
      numberItens: totalItens
    })
    setLoading(false)
  }

  useEffect(() => {
    if(dadosHeader.classificacao == '--') getDataInfo();
    if(!products) getProducts()
  }, [products, dadosHeader]);

  function handleChangeValues(){
    const form = formRef.current

    var indCampo = 0
    var totalDiscount = 0
    var totalItens = 0
    var frete = 0
    var totalPrice = 0
    const pricesShirt = [] as ShirtPrice[]

    //camisas
    if(form){
      try{
        if(products?.shirts.numberUnits){
          products.shirts.prods.forEach((shirt, index)=>{
            const preco = form.elements[indCampo++] as HTMLFormElement
            const desc = form.elements[indCampo++] as HTMLFormElement
  
            var valuePreco = preco.value as string
            var valueDesc = desc.value as string
  
            const newPriceCam = {
              precoUnit: setMonetaryNumber(valuePreco),
              descUnit: setMonetaryNumber(valueDesc),
            } as ShirtPrice
    
            pricesShirt.push(newPriceCam)
            
            totalPrice+= shirt.numberUnits * newPriceCam.precoUnit
            totalDiscount+= shirt.numberUnits * newPriceCam.descUnit
            totalItens+=shirt.numberUnits
          })
        }

        //outros produtos futuramente
      
        // frete
        const getFrete = form.elements[indCampo] as HTMLFormElement
        frete = setMonetaryNumber(getFrete.value)
        totalPrice+= frete
      } catch (e : any) {
        toast.error(e.message)
      } finally {
        //atualiza preços dos produtos
        setPrices({
          order:{
            discount: totalDiscount,
            shipping: frete,
            subtotal: totalPrice
          },
          shirts: pricesShirt
        })
      }
    }

    setProducts({
      shirts: {
        prods: products?.shirts.prods as Shirt[],
        numberUnits: products?.shirts.numberUnits as number
      },
      prices: {
        order: {
          discount: totalDiscount,
          shipping: frete,
          subtotal: totalPrice
        },
        shirts: pricesShirt
      },
      numberItens: totalItens
    })
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)

    //envio dos dados pra api com axios
    try {
      const currentId = getCurrentOrderId()
      const infos = getOrderInfos()

      const allShirts = getShirtModels()
      const details = {shirts:[] as ShirtDetails[]}
      
      if(products?.shirts.numberUnits){
        const costsShirt = products?.prices.shirts
        if(costsShirt){
          allShirts.forEach((shirtModel, index)=>{
            const allShirtStyles = [] as ShirtStyleDetails[]
            shirtModel.shirtStyles.forEach((shirtStyle)=>{
              allShirtStyles.push({
                mesh: shirtStyle.mesh,
                meshColor: shirtStyle.meshColor,
                shirtCollar: shirtStyle.shirtCollar as string,
                printingTechnique: shirtStyle.printingTechnique as string,
                printingColors: shirtStyle.printingColors as string,
                printingPositions: shirtStyle.printingPositions as string,
                sleeveColors: shirtStyle.sleeveColor as string,
                cuffStyle: shirtStyle.cuffStyle as string,
                specialElement: shirtStyle.specialElement as string,
                comments: shirtStyle.comments as string,
                attachments: shirtStyle.attachments as string[],
                sizes: shirtStyle.sizes as SizeGrid
              })
            })
  
            details.shirts.push({
              printName: shirtModel.printName,
              shirtType: shirtModel.shirtModeling,
              numberUnits: shirtModel.number_units,
              unitPrice: costsShirt[index].precoUnit,
              unitDiscount: costsShirt[index].descUnit,
              imageUrl: shirtModel.namePhotoModel as string,
              shirtStyles: allShirtStyles
            })
          })
        }
      }

      const pricesOrder = products?.prices
      const dataToRequest = {
        name: infos.nomePedido,
        customer_name: infos.nomeCliente,
        customer_phone: infos.telefoneCliente,
        shipping_cost: pricesOrder?.order.shipping as number,
        subtotal_value: pricesOrder?.order.subtotal as number,
        discount_value: pricesOrder?.order.discount as number,
        total_number_units: products?.numberItens,
        details: JSON.stringify(details),
        status: infos.status,
        company: infos.empresa,
        classification: infos.classificacao
      } as DataOrderToSend

      if(!currentId)
        axios.post(apiRouter.negotiations, dataToRequest,
          {
            headers: {
              'Authorization': getToken(),
              'Content-Type': 'application/json',
            }
          }
        ).then((response) => {
          const data = response.data;
          if (data.errors) {
            setLoading(false);
            toast.error('Ocorreu algum erro. Tente novamente');
          } else {
            setCurrentOrderId(data.dados.negotiation_id);
            router.push('/pedido/sucesso');
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error('Ocorreu um erro na requisição. Tente novamente mais tarde.');
        });

      else
        axios.put(apiRouter.negotiations + currentId + '/', dataToRequest,
          {
            headers: {
              'Authorization': getToken(),
              'Content-Type': 'application/json',
            }
          }
        ).then((response) => {
          const data = response.data;
          if (data.errors) {
            setLoading(false);
            toast.error('Ocorreu algum erro. Tente novamente');
          } else {
            router.push('/pedido/sucesso');
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error('Ocorreu um erro na requisição. Tente novamente mais tarde.');
        });

    } catch (error) {
      setLoading(false)
      toast.error('Ocorreu algum erro. Tente novamente')
    }
  }

  return (
    <>
      <Header.Root>
        <Header.BtnReturn></Header.BtnReturn>
        <Header.Title>{dadosHeader?.nomePedido}</Header.Title>
        <Header.Subtitle>{dadosHeader?.nomeCliente}</Header.Subtitle>
      </Header.Root>

      <div className={styles.grid}>
        <h1>{dadosHeader?.empresa}</h1>
        <h2>{dadosHeader.classificacao}</h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} method='post' style={{marginBottom: '80px'}}>
        {(products && products.numberItens>0)? 
          <div className={styles.divProds}>
            {products.shirts.numberUnits!=0 &&
              <div className={styles.grid} style={{margin: '0'}}>
                <h2><IconItem /> Camisas</h2>
                <h3 style={{fontWeight: 'normal'}}>{QtdUnidadesPorExtenso(products.shirts.numberUnits)}</h3>
              </div>
              }
            {products.shirts.prods.map((shirt, index) => (
              <div className={styles.lineProd}>
                <ItemModelo 
                  key={index} 
                  nomeModelo={shirt.printName} 
                  tipoCamisa={shirt.shirtModeling} 
                  qtdCamisas={shirt.numberUnits} 
                  url={`/camisa/${shirt.index}/`}
                  vertical
                />
                
                <div>
                  <InputText 
                    type='text'
                    label='Preço Unit.'
                    name={`precoUnitCam${index}`}
                    defaultValue={products.prices.shirts.length? getMonetaryString(products.prices.shirts[index].precoUnit, false) : '0'}
                    id={`precoUnitCam${index}`}
                    toMoney
                    onChange={handleChangeValues}
                    required
                  /> 

                  <InputText 
                    type='text'
                    label='Desc Unit.'
                    name={`descUnitCam${index}`}
                    id={`descUnitCam${index}`}
                    defaultValue={products.prices.shirts.length? getMonetaryString(products.prices.shirts[index].descUnit, false) : '0'}
                    toMoney
                    onChange={handleChangeValues}
                  />
                </div>
              </div>
            ))}
          </div>
          : (!products)?
              <div className={styles.spanBox}>
                <span className={mainStyles.labelDiscreto}>Cadastre produtos no pedido</span>
              </div>
              :
              <div>
                -------<br/>
                -------
              </div>
        }
        <div className={styles.divFrete}>
          <h2>Frete:</h2>
          <InputText 
            type='text'
            name={`frete`}
            defaultValue={products? getMonetaryString(products.prices.order.shipping, false):'0'}
            id={`frete`}
            toMoney
            onChange={handleChangeValues}
          />
        </div>

        <div className={`${styles.lineProd} ${styles.rodapeRecibo}`}>
          <h2>Total de Itens:</h2>
          <h2>{products && products.numberItens}</h2>
        </div>

        <div className={`${styles.lineProd} ${styles.rodapeRecibo}`}>
          <h2>Subtotal:</h2>
          <h2>{products && getMonetaryString(products.prices.order.subtotal as number)}</h2>
        </div>

        <div className={`${styles.lineProd} ${styles.rodapeRecibo}`}>
          <h2>Total Descontos:</h2>
          <h2>{products && getMonetaryString(products.prices.order.discount as number)}</h2>
        </div>

        <div className={`${styles.lineProd} ${styles.rodapeRecibo}`}>
          <h2>Total:</h2>
          <h2>{products && getMonetaryString(products.prices.order.subtotal as number -( products?.prices.order.discount as number))}</h2>
        </div>

        <Navbar.Root>
          <Navbar.Item icon={IconSave} submit>Finalizar</Navbar.Item>
        </Navbar.Root>
      </form>
    </>
  )
}