# Intergalactic Analytics Service

Полнофункциональная аналитическая платформа для исследования и визуализации межгалактических данных. 

---

## Навигация по коду

- `src/components/CsvAnalytics/` — вкладка **Аналитика** (CsvAnalytics.tsx + стили)
- `src/components/CsvGenerator/` — вкладка **Генерация CSV** (CsvGenerator.tsx + стили)
- `src/components/CsvHistory/` — вкладка **История загрузок** (CsvHistory.tsx + стили)
- `src/components/Header/` — общий **Header** для всех вкладок (Header.tsx + стили)
- `src/components/Modal/` — компонент модального окна (Modal.tsx + стили)
- `public/` — картинки
- `src/main.tsx` — точка входа React-приложения
- `src/index.module.css` — глобальные CSS-модули
---

## Установка и запуск

```bash
git clone https://github.com/Anastasia-Papchenko/Intergalactic-Analytics-Service.git
cd Intergalactic-Analytics-Service
npm install                # для фронтенда
cd shri2025-back
npm install                # для бэкенда
cd ..
npm start
```
Проект откроется по адресу [http://localhost:5173/](http://localhost:5173/) 


p.s. с помощью предустановленного модумя ```concurrently``` объединила запуск ```npm run dev``` и ```npm start``` в ```npm start``` 