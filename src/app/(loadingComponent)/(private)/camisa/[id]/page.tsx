'use client'
import Header from '@/components/Header'
import styles from './page.module.css'
import { BtnEdicaoHeader, IconCancel, IconNovoEstilo } from "@/utils/elements"
import { useEffect, useState } from 'react'
import { ShirtModel, useOrderContext, calcularInfosGrade, SizeGrid, ShirtStyle } from '@/context/orderContext'
import { useServerDataContext } from '@/context/serverDataContext'
import Navbar from '@/components/Navbar'
import mainStyles from '@/app/(loadingComponent)/(private)/main.module.css'
import toast from 'react-hot-toast'
import { useComponentsContext } from '@/context/componentsContext'
import { Option } from '@/components/Input/interfaceInput'
import ItemCombinacao from '@/components/ItemCombinacao'
import ItemCombinacaoIndicators from '@/components/ItemCombinacao/ItemCombinacaoIndicators'
import ModalYesOrNo from '@/components/ModalYesOrNo/indext'
import { useRouter } from 'next/navigation'
import BotaoLateral from '@/components/BotaoLateral'

export default function DashboardModel({ params }: { params: { id: number } }) {
  type dadosHeader = {
    printName: string
    shirtModeling: string
  }

  type ShirtStyleItem = {
    meshName: string
    meshColorName: string
    numberUnits: number
    haveObs: boolean
    haveAttachments: boolean
  }

  const router = useRouter()
  const { getShirtModel, getShirtModels, setShirtModels } = useOrderContext()
  const { setLoading } = useComponentsContext()
  const { getShirtType, getMeshColors, getMeshs, parseOptionName } = useServerDataContext()
  const [dadosHeader, setDadosHeader] = useState<dadosHeader>({printName: '--', shirtModeling: '--'})
  const [shirtStyles, setShirtStyles] = useState<ShirtStyleItem[] | null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDataInfo() {
      setLoading(true)
      const model = getShirtModel(params.id) as ShirtModel

      const shirtModel = await getShirtType(model.shirtModeling)

      if(shirtModel){
        setDadosHeader({
          printName: model.printName,
          shirtModeling: shirtModel
        } as dadosHeader);
      } else {
        toast.error('Ocorreu algum erro. Atualize a página')
      }
      setLoading(false)
    }

    async function getShirtStyles(){
      setLoading(true)
      const allModels = getShirtModels()
      const model = allModels[params.id]
      const allMeshs = await getMeshs() as Option[]
      const allMeshColors = await getMeshColors() as Option[]
      const styles = [] as ShirtStyleItem[]
      const attShirtStyles = [] as ShirtStyle[]
      var totalUnits = 0
      
      model.shirtStyles.forEach((style, index)=>{
        if(style.toSave){
          attShirtStyles.push(style)

          const infosSize = calcularInfosGrade(style.sizes as SizeGrid)
          styles.push({
            haveAttachments: style.attachments? style.attachments.length > 0: false,
            haveObs: style.comments? style.comments.trim() != '': false,
            meshName: parseOptionName(allMeshs, style.mesh) as string,
            meshColorName: parseOptionName(allMeshColors, style.meshColor) as string,
            numberUnits: infosSize.grandTotal
          })

          totalUnits+=infosSize.grandTotal
        }
      })

      model.shirtStyles = attShirtStyles
      model.number_units = totalUnits
      allModels[params.id] = model
      setShirtModels(allModels)

      setShirtStyles(styles)

      setLoading(false)
    }

    fetchDataInfo()
    getShirtStyles()
  }, []);

  return (
    <>
      <Header.Root>
          <Header.BtnReturn goto={'/novo-pedido/produtos'} />
          <Header.Title>{dadosHeader?.printName}</Header.Title>
          <Header.Subtitle>{dadosHeader?.shirtModeling}</Header.Subtitle>
          <Header.BtnExtra icon={BtnEdicaoHeader} onClick={()=>{
            setLoading(true)
            router.push(`/camisa/${params.id}/edit`)
          }}/>
      </Header.Root>

      <ModalYesOrNo 
            open={cancelModalOpen}
            question={`Tem certeza que deseja excluir a camisa ${dadosHeader?.printName}?`}
            onConfirm={()=>{
              const models = getShirtModels()
              const newModels = [] as ShirtModel[]
              models.forEach((model, index)=>{
                if(index!=params.id){
                  newModels.push(model)
                }
              })

              setShirtModels(newModels)

              setLoading(true)
              router.push('/novo-pedido/produtos')
            }}
            onClose={()=>{
              setCancelModalOpen(false)
              setLoading(false)
            }}
      />

      <BotaoLateral tipo='EXCLUIR' onClick={()=>{ setCancelModalOpen(true) }}></BotaoLateral>

      {(shirtStyles && shirtStyles.length)? 
        <div style={{marginTop: '20px'}}>
          {shirtStyles.map((style, index) => (
            <ItemCombinacao 
              cor={style.meshColorName} 
              malha={style.meshName} 
              qtdCamisas={style.numberUnits}
              url={`/camisa/${params.id}/${index}/estilo`}
            >
              {style.haveObs && <ItemCombinacaoIndicators tipo='obs'/>}
              {style.haveAttachments && <ItemCombinacaoIndicators tipo='anexo'/>}
            </ItemCombinacao>
          ))}
        </div>
        : (shirtStyles && !shirtStyles.length)?
            <div className={styles.spanBox}>
              <span className={mainStyles.labelDiscreto}>Não há malhas cadastradas<br/>nessa camisa</span>
            </div>
            :
            <div>
              -------<br></br>
              -------
            </div>
      }

      <Navbar.Root>
        <Navbar.Item icon={IconNovoEstilo} idcamisa={params.id}>Novo estilo</Navbar.Item>
      </Navbar.Root>
    </>
  )
}