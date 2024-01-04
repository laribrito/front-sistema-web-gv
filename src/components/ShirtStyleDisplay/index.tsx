// components/ShirtStyleDisplay.tsx

import { SecondShirtStyle, ShirtStyle } from '@/context/orderContext';
import styles from './shirtDisplay.module.css';
import { HTMLProps, RefObject, useState } from 'react';
import { useServerDataContext } from '@/context/serverDataContext';
import { Option } from '../Input/interfaceInput';

interface ShirtStyleDisplayProps extends HTMLProps<HTMLDivElement> {
  shirtStyle: SecondShirtStyle | null | undefined;
  refer?: RefObject<HTMLDivElement>;
}

export default function ShirtStyleDisplay({ shirtStyle, refer, ...rest }: ShirtStyleDisplayProps) {
  const camposSelecionados = [
    'shirtCollar', 
    'printingTechnique',
    'printingColors',
    'printingPositions',
    'sleeveColor',
    'cuffStyle',
    'specialElement',
    'sizeAdjustment'
  ] as string[];

  const camposPortugues = [
    'Gola', 
    'Técnica de Impressão',
    'Cores Estampa',
    'Posições Estampa',
    'Cores Manga',
    'Punho',
    'Elemento Especial',
    'Ajuste de tamanho'
  ];

  const {getCollars, parseOptionName} = useServerDataContext()
  const [collarName, setCollarName] = useState('')
  const golasPromise = getCollars();

  golasPromise.then((golas) => {
    if(golas && shirtStyle){
      setCollarName(parseOptionName(golas, shirtStyle.shirtCollar) as string)
    }
  })

  return (
    <div className={styles.display} ref={refer} {...rest}>
      {Object.entries(shirtStyle ?? {}).map(([key, value]) => {
        const index = camposSelecionados.indexOf(key);

        // Verifica se a chave está presente em camposSelecionados
        if (index !== -1 && typeof value === 'string' && value.trim() !== '') {
          return (
            <div key={key} className={styles.campos}>
              <p className={styles.titulo}>{camposPortugues[index]}:</p>
              <p>{camposPortugues[index] == 'Gola'? collarName : value}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
