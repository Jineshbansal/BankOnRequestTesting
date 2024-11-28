'use client'
import React, { useState, useEffect } from 'react';

export default function Navbar() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const savedAccount = localStorage.getItem('account');
        if (savedAccount) {
            setAccount(savedAccount);
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                localStorage.setItem('account', accounts[0]);
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        localStorage.removeItem('account');
    };

    return (
        <nav className='w-full bg-[#038962] p-4 flex justify-between items-center'>
            <div className='text-white text-2xl font-bold'>BankOnChain</div>
            <button
                className='bg-white text-[#038962] px-4 py-2 rounded-lg shadow-md hover:bg-gray-200'
                onClick={account ? disconnectWallet : connectWallet}
            >
                {account ? `Disconnect: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
            </button>
        </nav>
    );
}