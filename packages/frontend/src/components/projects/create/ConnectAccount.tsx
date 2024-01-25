import React from 'react';
import OauthPopup from 'react-oauth-popup';

const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user`;

const ConnectAccount = () => {
  const handleCode = (code: string, params: URLSearchParams) => {
    console.log('code', code);
    console.log('params', params);

    // TODO: Pass code to backend and get access token
  };

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
        <OauthPopup
          url={GITHUB_OAUTH_URL}
          onCode={handleCode}
          onClose={() => {}}
          title="Snowball"
          width={1000}
          height={1000}
        >
          <button className="bg-gray-300 rounded-full mx-2">
            Connect to Github
          </button>
        </OauthPopup>
        <button className="bg-gray-300 rounded-full mx-2">
          Connect to Gitea
        </button>
      </div>
    </div>
  );
};

export default ConnectAccount;
