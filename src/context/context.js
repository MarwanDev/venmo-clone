import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../utils/constants";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const TransactionContext = createContext();
const { ethereum } = window;
const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  return transactionsContract;
};
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("trasactionCount")
  );

  useEffect(() => {
    checkIfWaaletIsConnected();
    checkIfTransactionExists();
  }, [transactionCount]);
  const checkIfWaaletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please install Metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No Accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please install Metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum Object");
    }
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const availableTransactions =
          await transactionContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: timeAgo.format(
              new Date(transaction.timestamp.toNumber() * 1000),
              "mini"
            ),
            message: transaction.message,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );
        console.log(structuredTransactions);
        setTransactions(structuredTransactions);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionExists = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const currentTransactionCount =
          await transactionContract.getTransactionCount();
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });
        const transactionHash = await transactionContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount =
          await transactionContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        setAddressTo,
        addressTo,
        setAmount,
        amount,
        message,
        setMessage,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
