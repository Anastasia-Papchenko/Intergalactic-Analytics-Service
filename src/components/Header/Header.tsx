import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles['header']}>
            <div className={styles['logo-group']}>
                <img src="/Logo SS.png" alt="Логотип" className={styles['logo-img']} />
                <span className={styles['title']}>МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</span>
            </div>
            <nav className={styles['nav']}>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? `${styles['nav-link']} ${styles['active']}` : styles['nav-link']
                    }
                >
                    <img src="/Vector.png" alt="Иконка загрузки" className={styles['icon']} />
                    CSV Аналитик
                </NavLink>

                <NavLink
                    to="/generator"
                    className={({ isActive }) =>
                        isActive ? `${styles['nav-link']} ${styles['active']}` : styles['nav-link']
                    }
                >
                    <img src="/oui_ml-create-multi-metric-job.png" alt="Иконка генерации" className={styles['icon']} />
                    CSV Генератор
                </NavLink>

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        isActive ? `${styles['nav-link']} ${styles['active']}` : styles['nav-link']
                    }
                >
                    <img src="/solar_history-linear.png" alt="Иконка истории" className={styles['icon']} />
                    История
                </NavLink>
            </nav>
        </header>
    );
}
