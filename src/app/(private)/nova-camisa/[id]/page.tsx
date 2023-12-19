'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader,IconNovaCamisa } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(private)/main.module.css'

export default function DashboardModel({idModel}:{idModel:number}) {
  type dadosHeader = {
    printName: string
    shirtModeling: string
  }
  const { getOrderInfos, getShirtModel } = useOrderContext()
  const { getCompanies, getClassifications, parseOptionName, getShirtTypes } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<dadosHeader>({printName: '--', shirtModeling: '--'})

  useEffect(() => {
    async function fetchDataInfo() {
        console.log(idModel)
        const model = getShirtModel(idModel) as ShirtModel
        console.log(model)

        const allCurrentModels = await getShirtTypes()

        if(allCurrentModels){
          setDadosHeader({
            printName: model.printName,
            shirtModeling: allCurrentModels[model.shirtModeling].valor
          } as dadosHeader);
        } else {

        }
    }

    fetchDataInfo();
  }, []);

  return (
    <>
      <Header.Root>
          <Header.BtnReturn/>
          <Header.Title>{dadosHeader?.printName}</Header.Title>
          <Header.Subtitle>{dadosHeader?.shirtModeling}</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader}/>
      </Header.Root>

      <div className={styles.spanBox}>
        <span className={mainStyles.labelDiscreto}>Não há malhas cadastradas<br/>nessa camisa</span>
      </div>

      <Navbar.Root>
        <Navbar.Item icon={IconNovaCamisa}>Novo estilo</Navbar.Item>
      </Navbar.Root>
    </>
  )
}