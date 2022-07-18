import "./App.css";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import contract from "./artifacts/contracts/Lottery.sol/Lottery.json";
import ParticipantsProp from "./components/ParticipantsProp";
import { nanoid } from "nanoid";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { FcMoneyTransfer } from "react-icons/fc";
import {GrUserAdmin} from "react-icons/gr";
import lot from './images/lot1.png'
const App = () => {
  const [web3, setWeb3] = useState({
    provider: "",
    account: "",
    contract: "",
  });
  const [admin,setAdmin] = useState();
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(false);
  const [address, setaddress] = useState();
  const [reload, setReload] = useState(false);
  const [winAmount, setWinAmount] = useState();
  const [winner, SetWinner] = useState();
  const [err, setError] = useState(false);
  const doProvider = async () => {
    if (typeof window.ethereum == "undefined") {
      setError(true);
      console.log("MetaMask is not installed!");
    } else {
      const gettingProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const account = gettingProvider.getSigner();
      setaddress(account);
      const address = "0x2e498A8412B62E4242cDF039169fdDe783ec0f4F";
      try {
        if (gettingProvider) {
          await gettingProvider.send("eth_requestAccounts", []);
          const _account = await account.getAddress();
          const _contract = new ethers.Contract(
            address,
            contract.abi,
            gettingProvider
          );
          setWeb3({
            provider: gettingProvider,
            account: _account,
            contract: _contract,
          });
          setPage(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    const arrayParticipants = async () => {
      const _noOfparticipants = await web3.contract.length();
      for (let i = 0; i < _noOfparticipants; i++) {
        const _participants = await web3.contract.noOfParticipants(i);
        const check = participants.some((value) => value === _participants);
        if (!check)
          setParticipants((prevState) => [...prevState, _participants]);
      }
    };
    web3.provider && arrayParticipants();   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[web3.contract,reload]);


  useEffect(() => {
    const prizePool = async () => {
      const balance = await web3.provider.getBalance(
        "0x2e498A8412B62E4242cDF039169fdDe783ec0f4F"
      );
      setWinAmount(ethers.utils.formatUnits(balance));
    };
    web3.contract && prizePool();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.contract,reload]);

  useEffect(()=>{
    const getAdmin=async()=>{
      const admin=await web3.contract.admin();
      setAdmin(admin);
    }
    web3.contract && getAdmin();
  },[web3.contract]);

  const playLottery = async () => {
    const contractSigner = web3.contract.connect(address);
    await contractSigner.takePart({
      value: ethers.utils.parseEther("0.01"),
    });
    setTimeout(() => {
      setReload(!reload);
    }, "15000")
  };
  
  const MapArray = () => {
    const mapParticipants = participants.map((value) => (
      <ParticipantsProp key={nanoid()} address={value} />
    ));
    return mapParticipants;
  };  

  const winRandom = async () => {
    const contractSigner = web3.contract.connect(address);
    await contractSigner.randomWinner();
    const value1=await contractSigner.randomWin();
    const value =parseInt(value1);
    SetWinner(participants[value]);
    setReload(!reload);
  };

  
  const payWInner=async()=>{
    const contractSigner = web3.contract.connect(address);
    await contractSigner.winnerPay();
    setTimeout(() => {
      SetWinner('');
      setParticipants([]);
      setWinAmount('');
    }, "10000")
  }
 

  return (
    <>
    <main className="App">
      {!page && (
        <div className="walletdescribe">
          <FcMoneyTransfer className="money" />
          <p className="connectwallet">Test Your Luck</p>
          <p className="lottery">Play Lottery</p>
          <p className="connectwallet">
            Connect yourself to the Decentralized Web
          </p>
          <Button type="button" className="wallet" onClick={() => doProvider()}>
            Connect Wallet
          </Button>
        </div>
      )}
      {err && (
        <Alert className="installmeta" variant='info'>
          Install
          <Alert.Link className="meta" href="https://metamask.io/download/">
            {" "}
            MetaMask{" "}
          </Alert.Link>
        </Alert>
      )} 
        {page && <div>
        <h1 className="head">Your Chance to Win Starts Here</h1>
        </div>}
      {page && 
      <div className="grid">
        <div className="photo">
          <img src={lot} alt="lottery"/>
        </div>
      <div className="text-center card1" >
        <GrUserAdmin className="admin1"/>
        <p className="admin">Admin: {admin}</p>
        <h2>Test Your Luck</h2>
        <Button className="adminbutton" onClick={() => playLottery()}>Play Now!!</Button>
      </div>
       <div className="text-center card2" >
      <h2>Lottery Participants</h2>
      <MapArray />
      </div>
      <div className="text-center card3" >
      <h3>Lottery Pool : {winAmount} Ethers</h3>
      </div>
      <div className="card4">
          <p className="winner">Winner Address {winner}</p>
      </div>
      <div className="card5">
      <Button className="b1" onClick={()=>winRandom()}>Winner Call</Button>
      <Button className="b2" onClick={()=> payWInner()}>Pay Winner</Button>
      </div>
      </div>}
    </main>
    </>
  );
};

export default App;
