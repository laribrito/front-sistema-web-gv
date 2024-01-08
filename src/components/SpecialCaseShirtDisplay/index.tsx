import { HTMLProps } from 'react';
import styles from './scDisplay.module.css'
import { SpecialShirtStyle, calcularInfosGrade } from '@/context/orderContext';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import { useComponentsContext } from '@/context/componentsContext';

interface SCShirtDisplayProps extends HTMLProps<HTMLDivElement>{
    cases: SpecialShirtStyle[] | undefined
    idCamisa: number
    idShirtStyle: number
}

export default function SpecialCaseShirtDisplay({cases, idCamisa, idShirtStyle, ...rest}: SCShirtDisplayProps){
    const router = useRouter()
    const {setLoading} = useComponentsContext()

    return (
        <div className={styles.principal} {...rest}>
            <h3>Casos especiais: </h3>
            {cases && cases.length > 0 ? cases.map((caso, index)=>(
                <div className={styles.item} onClick={()=>{
                    setLoading(true)
                router.push(`/camisa/${idCamisa}/${idShirtStyle}/${index}/caso-especial/1/`)
                }}>
                    <p>Caso {index+1}</p>
                    <p>{caso.sizes && calcularInfosGrade(caso.sizes).grandTotal} Unidades</p>
                </div>
            )): (cases && cases.length==0)?
                <p className={styles.item}>Não há casos especiais</p>
                :
                <p className={styles.item}></p>
            }
            <Button type='button' onClick={()=>{
                setLoading(true)
                router.push(`/camisa/${idCamisa}/${idShirtStyle}/${cases?.length}/caso-especial/1/`)
            }}>Adicionar caso especial</Button>
        </div>
    )
}