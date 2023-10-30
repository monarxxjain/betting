import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";

const CreateBet = () => {
  const [senderName, setSenderName] = useState("");
  const [senderResponse, setSenderResponse] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverNumber, setReceiverNumber] = useState();
  const [criteria, setCriteria] = useState("");
  const [resolDate, setResolDate] = useState("");
  const [wager, setWager] = useState("");
  const [status, setStatus] = useState("pending");
  const [senderFinalResp, setSenderFinalResp] = useState("NIL");
  const [receiverFinalResp, setReceiverFinalResp] = useState("NIL");
  const senderNumber = localStorage.getItem("phone");
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Function to fetch user data
  const getUser = async () => {
    try {
      const user = await axios.get(
        `http://localhost:5500/user/${localStorage.getItem("user")}`
      );
      user = user.data;
      setUsername(user.name);
    
    }
    catch(e){
      
    }
  }
  const sendResp = async () => {
    try {
      const response = await axios.post(`http://localhost:5500/api/sendmessage`,
        {
          number: receiverNumber,
          receName: receiverName,
          sendName: senderName,
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };

  // Function to send a response to the counterparty
  // const sendResp = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5500/api/sendmessage",
  //       {
  //         number: receiverNumber,
  //       }
  //     );
  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.error("An error occurred while sending a response:", error);
  //   }
  // };

  // Function to initiate a bet
  const initiateBet = async () => {
    console.warn(resolDate);
    let receiverResponse='Yes'
    if(senderResponse =='Yes'){
        receiverResponse='No'
    }else{
      receiverResponse='Yes'
    }

    if (
      !senderName ||
      !senderResponse ||
      !senderNumber ||
      !receiverName ||
      !receiverNumber ||
      !criteria ||
      !resolDate ||
      !wager
    ) {
      setError(true);
      return;
    }

    if (isNaN(receiverNumber)) {
      setError(true);
      return;
    }

    const betData = {
      senderName,
      senderResponse,
      senderNumber,
      receiverName,
      receiverResponse,
      receiverNumber,
      criteria,
      resolDate,
      wager,
      status,
      senderFinalResp,
      receiverFinalResp,
    };

    try {
      const response = await axios.post(
        "http://localhost:5500/api/createbet",
        betData
      );

      if (response.status === 200) {
        // Calling the send response API after posting a new bet to get the bet confirmation from the counterparty.
        sendResp();
        alert("Bet created successfully");
        navigate("/home");
      } else {
        console.error("Error creating bet", response.status, response.data);
      }
    } catch (error) {
      console.error("An error occurred while creating the bet", error);
    }

    console.warn(
      senderName,
      senderResponse,
      senderNumber,
      receiverName,
      receiverResponse,
      receiverNumber,
      criteria,
      resolDate,
      wager,
      status
    );

   

  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getUser();
  }, []);


  return (
    <div className="w-screen h-full flex justify-center bg-blue-100 flex-col items-center">
      <Nav username={username} />
      <div className="bg-blue-100 w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-2xl">
        <h1 className="text-center text-3xl font-semibold mb-4">
          Initiate Bet
        </h1>
        <div className="mb-4 ">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="initName"
          >
            Initiator Name
          </label>
          <input
            type="text"
            id="senderName"
            placeholder="Enter initiator's name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />

          {error && !senderName && (
            <span className="text-red-500 text-left">Enter a valid name</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-slate-900 text-sm font-bold mb-2 text-left">
            Initiator Response
          </label>

          <div className="flex items-start">
            <div className="mr-2">
              <label>
                <input
                  type="radio"
                  name="senderResponse"
                  value="Option 1"
                  checked={senderResponse === "Yes"}
                  onChange={() => setSenderResponse("Yes")}
                  className="mr-1"
                />
                Yes
              </label>
            </div>
            <div className="mr-2">
              <label>
                <input
                  type="radio"
                  name="senderResponse"
                  value="Option 2"
                  checked={senderResponse === "No"}
                  onChange={() => setSenderResponse("No")}
                  className="ml-3 mr-1"
                />
                No
              </label>
            </div>
          </div>

          {error && !senderResponse && (
            <span className="text-red-500 text-left">Select a response</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="receiverName"
          >
            Counterparty Name
          </label>
          <input
            type="text"
            id="receiverName"
            placeholder="Enter counterparty's name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />

          {error && !receiverName && (
            <span className="text-red-500 text-left">Enter a valid name</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="wager"
          >
            Counterparty Phone Number
          </label>
          <input
            type="text"
            id="receiverNumber"
            placeholder="Enter Counterparty Number"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={receiverNumber}
            onChange={(e) => setReceiverNumber(e.target.value)}
          />
          {error && (!receiverNumber || isNaN(receiverNumber)) && (
            <span className="text-red-500 text-left">
              Enter a valid Phone number
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="criteria"
          >
            Criteria
          </label>
          <textarea
            type="text"
            id="criteria"
            placeholder="Enter criteria"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
          />
          {error && !criteria && (
            <span className="text-red-500 text-left">Enter valid criteria</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="resolDate"
          >
            Resolution Date
          </label>
          <input
            type="datetime-local"
            id="resolDate"
            placeholder="Enter resolution date"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={resolDate}
            onChange={(e) => setResolDate(e.target.value)}
          />

          {error && !resolDate && (
            <span className="text-red-500 text-left">Enter a valid date</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="wager"
          >
            Wager
          </label>
          <input
            type="text"
            id="wager"
            placeholder="Enter wager"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
          />
          {error && !wager && (
            <span className="text-red-500 text-left">Enter a valid wager</span>
          )}
        </div>

        <button
          onClick={initiateBet}
          className="text-xl bg-blue-500 text-slate-50 px-4 py-2 font-semibold rounded-lg w-full active:scale-105 duration-200 "
        >
          Initiate Bet
        </button>
      </div>
    </div>
  );
};

export default CreateBet;
