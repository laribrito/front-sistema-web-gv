'use client'
import Header from '@/components/Header'
import { BtnEdicaoHeader, IconNovoEstilo } from "@/utils/elements"
import { Children, useEffect, useState } from 'react'
import { ShirtModel, useOrderContext } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
import BotaoLateral from '@/components/BotaoLateral'
import ModalYesOrNo from '@/components/ModalYesOrNo/indext'
import { useComponentsContext } from '@/context/componentsContext'

export default function CanRemoveStyle({children, params}: { children: React.ReactNode, params:{id: number, idshirtstyle: number}}) {
    type dadosHeader = {
        printName: string
        shirtModeling: string
    }

    const {setLoading} = useComponentsContext()
    const { getShirtModels, setShirtModels } = useOrderContext()
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const router = useRouter();

  useEffect(() => {
    
  }, []);

  return (
    <>
      <ModalYesOrNo 
        open={modalOpen}
        question={`Tem certeza que deseja excluir esse estilo?`}
        onConfirm={()=>{
          const models = getShirtModels()
          models[params.id].shirtStyles[params.idshirtstyle].toSave = false
          setShirtModels(models)
          setLoading(true)
          router.push(`/camisa/${params.id}`)
        }}
        onClose={()=>{
          setModalOpen(false)
          setLoading(false)
        }}
      />

      <BotaoLateral tipo="EXCLUIR" onClick={()=> { setModalOpen(true) }}/>
      
      {children}
    </>
  )
}