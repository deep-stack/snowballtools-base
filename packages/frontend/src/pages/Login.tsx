import React from 'react';
import './Snow.css';
import { useWalletConnectContext } from 'context/WalletConnectContext';

const Login = () => {
  const { connect } = useWalletConnectContext()

  return (
    <div className="flex items-center justify-center h-screen bg-snowball-900 snow">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/logo.svg"
          alt="snowball logo"
          className="w-32 h-32 rounded-full mb-4"
        />
        {/* <w3m-button /> */}
        <button onClick={connect}>Connect</button>
      </div>
    </div>
  );
};

export default Login;
