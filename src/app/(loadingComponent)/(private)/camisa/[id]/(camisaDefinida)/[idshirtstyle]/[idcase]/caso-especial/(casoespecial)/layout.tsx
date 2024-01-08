'use client'
import BotaoLateral from "@/components/BotaoLateral";
import ModalYesOrNo from "@/components/ModalYesOrNo/indext";
import { useComponentsContext } from "@/context/componentsContext";
import { SpecialShirtStyle, useOrderContext } from "@/context/orderContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CasoEspecial({children, params}: { children: React.ReactNode, params:{id: number, idshirtstyle: number, idcase: number}}) {
  const router = useRouter()
  const [specialcase, setSpecialCase] = useState<SpecialShirtStyle>()
  const { getShirtModel, getShirtModels, setShirtModels } = useOrderContext()
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const {setLoading} = useComponentsContext()

  useEffect(()=>{
    const current = getShirtModel(params.id)
    const currentStyle = current.shirtStyles[params.idshirtstyle]
    const currentCase = currentStyle.specials?  currentStyle.specials[params.idcase] : null

    if(currentCase)
      setSpecialCase(currentCase)
  }, [])
  return (
    <>        
      {children}
      <ModalYesOrNo 
            open={cancelModalOpen}
            question={`Tem certeza que deseja excluir esse caso especial?`}
            onConfirm={()=>{
              const models = getShirtModels()
              if(models[params.id].shirtStyles[params.idshirtstyle].specials){
                const specials = models[params.id].shirtStyles[params.idshirtstyle].specials
                if(specials){
                  specials.splice(params.idcase, 1)
                  models[params.id].shirtStyles[params.idshirtstyle].specials = specials
                  setShirtModels(models)

                  const urlAtual = window.location.href
                  setLoading(true)
                  if(urlAtual[urlAtual.length-1]=='2') router.back()
                  router.back()
                }
              }
              // const newModels = [] as ShirtModel[]
              // modesls.forEach((model, index)=>{
              //   if(index!=params.id){
              //     newModels.push(model)
              //   }
              // })

              // setShirtModels(newModels)

              // setLoading(true)
              // router.push('/pedido/produtos')
            }}
            onClose={()=>{
              setCancelModalOpen(false)
              setLoading(false)
            }}
      />
      {specialcase && specialcase.sizes && <BotaoLateral tipo='EXCLUIR' onClick={()=>{ setCancelModalOpen(true) }}></BotaoLateral>}
    </>
  )
}