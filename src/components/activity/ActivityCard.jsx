import { GlobeIcon, UserGroup, UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import styles from "../../styles/Activity.module.css";
function ActivityCard() {
  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <p className={styles.tabTitle}>Activity</p>
        <div className={styles.navigationContainer}>
          <div className={styles.navigationItem} data-current>
            <GlobeIcon className={styles.navigationIcon}/>
          </div>
          <div className={styles.navigationItem}>
            <UserIcon className={styles.navigationIcon}/>
          </div>
          <div className={styles.navigationItem}>
            <UserGroupIcon className={styles.navigationIcon}/>
          </div>
        </div>
      </div>
      <div className={styles.feedList}></div>
    </div>
  );
}

export default ActivityCard;
