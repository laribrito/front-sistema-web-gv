'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader,IconNovaCamisa, IconNovoEstilo } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { OrderInfos, ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(loadingComponent)/(private)/main.module.css'

export default function DashboardModel({ params }: { params: { id: number } }) {
  type dadosHeader = {
    printName: string
    shirtModeling: string
  }
  const { getOrderInfos, getShirtModel } = useOrderContext()
  const { getCompanies, getClassifications, parseOptionName, getShirtType } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<dadosHeader>({printName: '--', shirtModeling: '--'})

  useEffect(() => {
    async function fetchDataInfo() {
        const model = getShirtModel(params.id) as ShirtModel

        const shirtModel = await getShirtType(model.shirtModeling)

        if(shirtModel){
          setDadosHeader({
            printName: model.printName,
            shirtModeling: shirtModel
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
        <Navbar.Item icon={IconNovoEstilo} idcamisa={params.id}>Novo estilo</Navbar.Item>
      </Navbar.Root>
    </>
  )
}