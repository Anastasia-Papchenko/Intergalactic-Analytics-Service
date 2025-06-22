import { useState } from 'react';
import styles from './CsvGenerator.module.css';

export default function CsvGenerator() {
  const [status, setStatus] = useState<'none' | 'generating' | 'done' |'error'>('none');
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  const handleGenerate = async () => {
    setStatus('generating');
    try {
      const response = await fetch('http://localhost:3000/report?size=0.1');
      if (!response.ok) throw new Error('Ошибка при генерации файла');

      const blob = await response.blob();
      setFileBlob(blob);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!fileBlob) return;

    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles['generatorContainer']}>
      <p className={styles['description']}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </p>

      {status === 'none' && (
        <button className={styles['generateButton']} onClick={handleGenerate}>
          Начать генерацию
        </button>
      )}

      {status === 'generating' && (
        <div className={styles['status']}>
          <div className={styles['spinnerPros']}>
            <div className={styles['spinner']}></div>
          </div>
          <p className={styles['text']}>идёт процесс генерации</p>
        </div>
      )}

      {status === 'done' && (
        <div>
          <div className={styles['statusDone']}>
            <div className={styles['doneBox']} onClick={handleDownload}>
            <span>Done!</span>
            </div>
            <button className={styles['clear-btn']} onClick={() => setStatus('none')}>
              <img
                src="/proicons_cancel.png"
                alt="Крестик"
                className={styles['clear-icon']}
              />
            </button>
          </div>
          <p className={styles['text']}>файл сгенерирован!</p>
        </div>
      )}

      {status === 'error' && (
        <div>
        <div className={styles['statusErr']}>
            <div className={styles['errBox']} onClick={handleDownload}>
            <span>Ошибка</span>
            </div>
            <button className={styles['clear-btn']} onClick={() => setStatus('none')}>
              <img
                src="/proicons_cancel.png"
                alt="Крестик"
                className={styles['clear-icon']}
              />
            </button>
          </div>
          <p className={styles['textErr']}>упс, не то...</p>
        </div>
      )}
    </div>
  );
}
