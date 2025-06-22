import React, { useState } from 'react';
import styles from './CsvAnalytics.module.css';

export default function CsvAnalytics() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'none' | 'invalid' | 'loaded' | 'ready' >('none');
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<null | unknown | string>(null);
  const [infoMessage, setInfoMessage] = useState('готово!');



  const getDateFromDayOfYear = (dayOfYear: number): string => {
    const date = new Date(2025, 0);
    date.setDate(dayOfYear);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const formatNumber = (value: number) => Math.round(value).toLocaleString('ru-RU');


  const checkFile = (f: File) => {
    const isCsv = f.name.toLowerCase().endsWith('.csv');
    setFile(f);
    setStatus(isCsv ? 'loaded' : 'invalid');
    setParsing(false);     
    setResult(null); 
    setInfoMessage('файл загружен!');

  };

  const clearFile = () => {
    setFile(null);
    setStatus('none');
    setResult(null);
    setParsing(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) checkFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) checkFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async () => {
    if (!file || status !== 'loaded') return;
    const form = new FormData();
    form.append('file', file);
    setParsing(true);

  
    try {
      const res = await fetch('http://localhost:3000/aggregate?rows=1000000', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error('Ошибка загрузки');

      const text = await res.text();
      
      const lines = text.trim().split('\n').filter(Boolean);
      const lastLine = lines[lines.length - 1];
      let parsedLast = null;

      try {
        parsedLast = JSON.parse(lastLine);
      } catch {
        console.error('Последняя строка невалидный JSON:', lastLine);
      }

      setResult(text);
      setInfoMessage('готово!');
      setStatus('ready');

      if (parsedLast) {
        const historyItem = {
          id: crypto.randomUUID(),
          fileName: file.name,
          date: new Date().toLocaleDateString('ru-RU'),
          data: parsedLast,
        };
        console.log('Добавляем в историю:', historyItem);
        const oldHistory = JSON.parse(localStorage.getItem('csv-history') || '[]');
        localStorage.setItem('csv-history', JSON.stringify([historyItem, ...oldHistory]));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Ошибка при отправке: ${err.message}`);
      } else {
        alert('Неизвестная ошибка при отправке');
      }
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className={styles['analytics-container']}>
      <p className={styles['description']}>
        Загрузите <b>csv</b> файл и получите <b>полную информацию</b> о нём за сверхнизкое время
      </p>

      <div
        className={`${styles['upload-area']} ${
          status === 'invalid'
            ? styles['upload-area-error']
            : status === 'loaded'
            ? styles['upload-area-success']
            : status === 'ready'
            ? styles['upload-area-success']
            : ''
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          type="file"
          accept=".csv"
          id="csv-upload"
          onChange={onFileChange}
          className={styles['hidden-input']}
        />

        {!file && (
          <>
            <label htmlFor="csv-upload" className={styles['upload-btn']}>
              Загрузить файл
            </label>
            <p className={styles['upload-p']}>или перетащите сюда</p>
          </>
        )}

        {file && (
          <>
            <div className={styles['file']}>
              <div className={`${styles['file-pill']} ${
                status === 'invalid'
                  ? styles['file-pill-error']
                  : status === 'loaded'
                  ? styles['file-pill-success']
                  : status === 'ready'
                  ? styles['file-pill-ready']
                  : ''
              } ${parsing ? styles['file-pill-parsing'] : ''}`}>
                {parsing ? (
                  <div className={styles['loaderSmall']} />
                ) : (
                  file.name
                )}
              </div>

              {!parsing && (
                    <button className={styles['clear-btn']} onClick={clearFile}>
                      <img
                        src="/proicons_cancel.png"
                        alt="Крестик"
                        className={styles['clear-icon']}
                      />
                    </button>)}
            </div>
                  
            
            <p
              className={
                status === 'invalid'
                  ? styles['error-msg']
                  : styles['success-msg']
              }
            >
              {status === 'invalid' 
              ? 'упс, не то…' 
              : parsing
              ? 'идёт парсинг файла'
              : infoMessage}
            </p>
          </>
        )}
      </div>

      {status === 'loaded' && !parsing && (
        <button
          className={`${styles['submit-btn']} ${styles['submit-btn-active']}`}
          onClick={onSubmit}
        >
          Отправить
        </button>
      
      )}
      {status === 'none' && (
        <button className={styles['submit-btn']} disabled>
          Отправить
        </button>
      )}

    <div className={styles['highlights-placeholder']}>
    {result ? (
      (() => {
        const lastLine = (result as string).trim().split('\n').filter(Boolean).slice(-1)[0];
        try {
          const data = lastLine ? JSON.parse(lastLine) : null;
          return data ? (
            <div className={styles['resultGrid']}>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{formatNumber(data.total_spend_galactic)}</div>
                <div className={styles['label']}>общие расходы в галактических кредитах</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{data.less_spent_civ}</div>
                <div className={styles['label']}>цивилизация с минимальными расходами</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{data.rows_affected}</div>
                <div className={styles['label']}>количество обработанных записей</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{getDateFromDayOfYear(data.big_spent_at)}</div>
                <div className={styles['label']}>день года с максимальными расходами</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{getDateFromDayOfYear(data.less_spent_at)}</div>
                <div className={styles['label']}>день года с минимальными расходами</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{formatNumber(data.big_spent_value)}</div>
                <div className={styles['label']}>максимальная сумма расходов за день</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{data.big_spent_civ}</div>
                <div className={styles['label']}>цивилизация с максимальными расходами</div>
              </div>
              <div className={styles['resultCard']}>
                <div className={styles['value']}>{formatNumber(data.average_spend_galactic)}</div>
                <div className={styles['label']}>средние расходы в галактических кредитах</div>
              </div>
            </div>
          ) : (
            <p>Не удалось прочитать данные</p>
          );
        } catch {
          return <p>Ошибка при разборе ответа</p>;
        }
      })()
    ) : (
      <p>
        Здесь<br />появятся хайлайты
      </p>
    )}
  </div>


    </div>
  );
}
