// components/ShirtStyleDisplay.tsx

import { ShirtStyle } from '@/context/orderContext';
import styles from './shirtDisplay.module.css';
import { RefObject } from 'react';

interface ShirtStyleDisplayProps {
  shirtStyle: ShirtStyle | null | undefined;
  refer?: RefObject<HTMLDivElement>;
}

export default function ShirtStyleDisplay({ shirtStyle, refer }: ShirtStyleDisplayProps) {
  const camposSelecionados = [
    'shirtCollar', 
    'printingTechnique',
    'printingColors',
    'printingPositions',
    'sleeveColor',
    'cuffStyle',
    'specialElement',
  ] as string[];

  const camposPortugues = [
    'Gola', 
    'Técnica de Impressão',
    'Cores Estampa',
    'Posições Estampa',
    'Cores Manga',
    'Punho',
    'Elemento Especial',
  ];

  return (
    <div className={styles.display} ref={refer}>
      {Object.entries(shirtStyle ?? {}).map(([key, value]) => {
        const index = camposSelecionados.indexOf(key);

        // Verifica se a chave está presente em camposSelecionados
        if (index !== -1 && typeof value === 'string' && value.trim() !== '') {
          return (
            <div key={key} className={styles.campos}>
              <p className={styles.titulo}>{camposPortugues[index]}:</p>
              <p>{value}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
