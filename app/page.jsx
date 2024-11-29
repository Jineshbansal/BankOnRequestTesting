'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { providers } from "ethers";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js"
import { Types, Utils } from "@requestnetwork/request-client.js";
export default function Home() {

  const createRequest = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      console.log("provider", provider);
      const accounts = await provider.send("eth_accounts", []);
      console.log("Accounts:", accounts); // Should not be empty

      const signer = provider.getSigner();
      console.log('Signer:', signer);
    
      const web3SignatureProvider = new Web3SignatureProvider(provider);
      console.log("Web3SignatureProvider initialized:", web3SignatureProvider);
      
      
      const requestClient=new RequestNetwork({
        nodeConnectionConfig: { 
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
      })
      console.log("request Client:",requestClient);
      const request = await requestClient.createRequest(requestCreateParameters);
      console.log("confirmed Request Data:",confirmedRequestData);
      const confirmedRequestData = await request.waitForConfirmation();
      console.log("confirmed Request Data:",confirmedRequestData);
      alert('Wallet connected successfully!');
    } else {
      console.error('Ethereum provider (window.ethereum) is not available. Please install MetaMask.');
    }
  };


  const payeeIdentity = '0xB23A92873a2d8d7B5a9B7c53EBB3c55055c3DA3f';
  const payerIdentity = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';
  const paymentRecipient = payeeIdentity;
  const feeRecipient = '0x0000000000000000000000000000000000000000';
  const requestCreateParameters = 
  {
    requestInfo: {
      
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: '0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C',
        network: 'sepolia',
      },
      
      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
      expectedAmount: '1000000000000000000',
      
      // The payee identity. Not necessarily the same as the payment recipient.
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      
      // The payer identity. If omitted, any identity can pay the request.
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      
      // The request creation timestamp.
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    
    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: 'sepolia',
        paymentAddress: payeeIdentity,
        feeAddress: feeRecipient,  
        feeAmount: '0',
      },
    },
    
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: '🍕',
      dueDate: '2023.06.16',
    },
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };
  
  
  const handleClick = async () => {
    console.log('button clicked');
    await createRequest();
    alert('You clicked button!');
    
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center'>
      <Navbar />
      <header className='text-center mb-8 mt-8'>
        <h1 className='text-4xl font-bold text-[#038962]'>Welcome to BankOnChain</h1>
        <p className='text-lg text-gray-700'>Your decentralized solution for lending and borrowing</p>
      </header>
      <section className='w-full max-w-4xl flex flex-col md:flex-row justify-around items-center'>
        <div 
          className='feature bg-white p-6 rounded-lg shadow-md m-4 cursor-pointer' 
          onClick={handleClick} // Add onClick handler here
        >
          <h2 className='text-2xl font-semibold text-[#038962]'>Create Request</h2>
          <p className='text-gray-600'>Earn interest by lending your assets to our secure pool.</p>
        </div>
        <div className='feature bg-white p-6 rounded-lg shadow-md m-4'>
          <h2 className='text-2xl font-semibold text-[#038962]'>Borrow Money</h2>
          <p className='text-gray-600'>Access funds quickly and easily from our decentralized pool.</p>
        </div>
      </section>
      <footer className='mt-8 text-gray-600'>
        <p>Powered by Request Network</p>
      </footer>
    </div>
  )
}
