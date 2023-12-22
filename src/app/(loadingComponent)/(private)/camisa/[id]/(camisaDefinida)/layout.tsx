'use client'
import Header from '@/components/Header'
import { BtnEdicaoHeader, IconNovoEstilo } from "@/utils/elements"
import { Children, useEffect, useState } from 'react'
import { ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'

export default function DashboardModel({children, params}: { children: React.ReactNode, params:{id: number}}) {
    type dadosHeader = {
        printName: string
        shirtModeling: string
    }

    const { getShirtModel } = useOrderContext()
    const { getShirtType } = useServerDataContext()
    const [dadosHeader, setDadosHeader] = useState<dadosHeader>({printName: '--', shirtModeling: '--'})

    const router = useRouter();

  useEffect(() => {
    async function fetchDataInfo() {
        if(params.id){
            const model = getShirtModel(params.id) as ShirtModel
    
            const shirtModel = await getShirtType(model.shirtModeling)
    
            if(shirtModel){
              setDadosHeader({
                printName: model.printName,
                shirtModeling: shirtModel
              } as dadosHeader);
            } else {
                toast.error('Algo não ocorreu corretamente. Recarregue a página')
            }
        } else {
            toast.error('Algo não ocorreu corretamente. Recarregue a página')
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
      </Header.Root>

        
      {children}
    </>
  )
}