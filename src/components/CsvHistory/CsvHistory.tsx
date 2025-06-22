import { useEffect, useState } from 'react';
import styles from './CsvHistory.module.css'; 
import Modal from "../Modal/Modal";

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  data: unknown;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [modalItem, setModalItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('csv-history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('csv-history', JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem('csv-history');
  };

  return (
    <div className={styles['historyWrapper']}>
      {history.length === 0 ? (
        <p className={styles['empty']}>История пуста</p>
      ) : (
        <div className={styles['list']}>
          {history.map(item => {
          const isSuccess =
            item.data &&
            typeof item.data === 'object' &&
            Object.values(item.data).every(
              val => val !== null && val !== '' && val !== undefined
            );
          
            return (
              <div className={styles['cardTrash']}>
                <div key={item.id} className={styles['card']} onClick={() => setModalItem(item)}>

                  <div className={styles['info']}>
                    <span className={styles['name']}>
                      <img src="/Group.png" alt="file" />
                      {item.fileName}
                    </span>
                    <span className={styles['date']}>{item.date}</span>

                    {isSuccess ? (
                      <><span className={styles['resultSuccess']}>
                        Обработан успешно <img src="/Smile_1.png" alt="Smile" />
                      </span>
                        <span className={styles['resultFail']}>
                          Не удалось обработать <img src="/Sadness_2.png" alt="Sadness" />
                        </span></>
                    ) : (
                      <>
                      <span className={styles['resultFail']}>
                        Обработан успешно <img src="/Smile_2.png" alt="Smile" />
                      </span>
                      <span className={styles['resultSuccess']}>
                        Не удалось обработать <img src="/Sadness_1.png" alt="Sadness" />
                      </span></>
                    )}
                  </div>
          
              </div>
                <button className={styles['deleteBtn']} onClick={() => deleteItem(item.id)}>
                  <img src="/Trash.png" alt="Trach" />
                </button>
              </div>
            )})}
        </div>
      )}

      <div className={styles['buttons']}>
        <button className={styles['greenBtn']} onClick={() => window.location.href = '/'}>
          Сгенерировать больше
        </button>
        <button className={styles['blackBtn']} onClick={clearAll}>
          Очистить всё
        </button>
      </div>
      {modalItem && (
        <Modal onClose={() => setModalItem(null)}>
          {typeof modalItem.data === 'object' && modalItem.data !== null ? (
            Object.entries(modalItem.data as Record<string, unknown>).map(([key, value]) => (
              <div key={key} className={styles['resultBlock']}>
                <strong>{value?.toString() || '–'}</strong>
                <div className={styles['resultLabel']}>{key}</div>
              </div>
            ))
          ) : (
            <p>Нет данных для отображения</p>
          )}
        </Modal>
    )}
    </div>
  );
}
