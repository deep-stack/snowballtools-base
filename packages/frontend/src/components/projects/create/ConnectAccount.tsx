import React from 'react';

const ConnectAccount = () => {
  return (
    <div className="bg-gray-100 flex flex-col p-4 justify-end items-center text-center text-sm h-60 rounded-2xl">
      <div>^</div>
      <div>
        <p>Connect to your git account</p>
        <p>
          Once connected, you can create projects by importing repositories
          under the account
        </p>
      </div>
      <div>
        <button className="bg-gray-300 rounded-full mx-2">
          Connect to Github
        </button>
        <button className="bg-gray-300 rounded-full mx-2">
          Connect to Gitea
        </button>
      </div>
    </div>
  );
};

export default ConnectAccount;
