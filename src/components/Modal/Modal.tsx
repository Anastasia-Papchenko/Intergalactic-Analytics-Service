import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { useEffect, type ReactNode, isValidElement } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

const getDateFromDayOfYear = (
  value: number | React.ReactElement
): string => {
  let dayOfYear: number;

  if (typeof value === 'number') {
    dayOfYear = value;
  } else {
    const children = (value.props as { children: string }).children;
    dayOfYear = parseInt(children, 10);

    if (isNaN(dayOfYear)) {
      throw new Error('Invalid day of year');
    }
  }

  const date = new Date(2025, 0); 
  date.setDate(dayOfYear);

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};

const roundNumberFromElement = (
  valueElement: React.ReactElement
): number => {
  const children = (valueElement.props as { children: string }).children;
  const number = parseFloat(children);

  if (isNaN(number)) {
    throw new Error('Children must be a number or numeric string');
  }

  return Math.round(number);
};


const keyToLabel: Record<string, string> = {
  total_spend_galactic: 'Общие расходы в галактических кредитах',
  rows_affected: 'Количество обработанных записей',
  less_spent_at: 'День года с минимальными расходами',
  big_spent_at: 'День года с максимальными расходами',
  less_spent_value: 'Минимальная сумма расходов за день',
  big_spent_value: 'Максимальная сумма расходов за день',
  average_spend_galactic: 'Средние расходы в галактических кредитах',
  big_spent_civ: 'Цивилизация с максимальными расходами',
  less_spent_civ: 'Цивилизация с минимальными расходами',
};

const excludedKeys = ['less_spent_value'];
const lessspentat = ['less_spent_at'];
const bigspentat = ['big_spent_at'];
const total_spend_galactic = ['total_spend_galactic'];
const big_spent_value = ['big_spent_value'];
const average_spend_galactic = ['average_spend_galactic'];


export default function Modal({ children, onClose, title }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  console.log('Modal children:', children);
  const renderChildren = () => {
    if (!children) return null;

    const childArray = Array.isArray(children) ? children : [children];

    return childArray.map((child, index) => {
        if (isValidElement(child)) {
            const key = child.key?.toString() ?? `field-${index}`;
            if (excludedKeys.includes(key)) return null;
            

            const label = keyToLabel[key] || '';

            const element = child as React.ReactElement<{ children: React.ReactNode }>;


            const valueElement = Array.isArray(element.props.children)
            ? element.props.children[0]
            : element.props.children;

            console.log(valueElement);
            if (bigspentat.includes(key) || lessspentat.includes(key)) {
                return (
                <div key={key} className={styles['card']}>
                    <div className={styles['values']}>{getDateFromDayOfYear(valueElement)}</div>
                    {label && <div className={styles['label']}>{label}</div>}
                </div> 
                );
            }
            if (total_spend_galactic.includes(key) || big_spent_value.includes(key) || average_spend_galactic.includes(key)) {
                return (
                <div key={key} className={styles['card']}>
                    <div className={styles['values']}>{roundNumberFromElement(valueElement)}</div>
                    {label && <div className={styles['label']}>{label}</div>}
                </div> 
                );
            }
            return (
            <div key={key} className={styles['card']}>
                <div className={styles['value']}>{(valueElement)}</div>
                {label && <div className={styles['label']}>{label}</div>}
            </div>
            );
        }
        return null;
        });
  };

  return ReactDOM.createPortal(
    <div className={styles['overlay']} onClick={onClose}>
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles['title']}>{title}</h2>}
        <div className={styles['content']}>{renderChildren()}</div>
      </div>
      <button onClick={onClose} className={styles['closeBtn']}>
        <img src="/proicons_cancel.png" alt="Закрыть" className={styles['closeIcon']} />
      </button>
    </div>,
    document.body
  );
}

