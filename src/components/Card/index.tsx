import React from 'react';
import styles from './card.css';


interface AppCardProps {
  name: string;
  description: string;
  userCount: string;
  icon: string;
  iconBg: string;
  isDesktop?: boolean;
}

const AppCard = ({ name, description, userCount, icon, iconBg, isDesktop = false }: AppCardProps) => {
  return (
    <div className={`${styles.appCard} ${isDesktop ? styles.isDesktop : ''}`}>
      <div className={styles.cardHeader}>
        <div className={`${styles.iconContainer}`} style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <div className={styles.cardDetails}>
          <h3 className={styles.cardName}>{name}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userIcon}></div>
          <span className={styles.userCount}>{userCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
