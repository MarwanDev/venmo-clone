import styles from "./styles/App.module.css";
import ActivityCard from './components/activity/ActivityCard'
import Navbar from "./components/Navbar";
import  TransactionForm  from "./components/transaction/TransactionForm";
function App() {
  return (
    <div className={styles.wrapper}>
      <header>
        <Navbar />
      </header>
      <main className={styles.mainContainer}>
        <div className={styles.activityContainer}><ActivityCard /></div>
        <div className={styles.sideContainer}>
          <TransactionForm />
        </div>
      </main>
    </div>
  );
}

export default App;
