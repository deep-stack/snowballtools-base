import { Button } from '@material-tailwind/react';
import React from 'react';
import OauthPopup from 'react-oauth-popup';

import { useGQLClient } from '../../../context/GQLClientContext';
import ConnectAccountTabPanel from './ConnectAccountTabPanel';

const SCOPES = 'repo user';
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${
  process.env.REACT_APP_GITHUB_CLIENT_ID
}&scope=${encodeURIComponent(SCOPES)}`;

interface ConnectAccountInterface {
  onAuth: (token: string) => void;
}

const ConnectAccount = ({ onAuth: onToken }: ConnectAccountInterface) => {
  const client = useGQLClient();

  const handleCode = async (code: string) => {
    // Pass code to backend and get access token
    const {
      authenticateGitHub: { token },
    } = await client.authenticateGitHub(code);
    onToken(token);
  };

  // TODO: Use correct height
  return (
    <div className="bg-gray-100 flex flex-col p-4 justify-center items-center text-center text-sm h-full rounded-2xl">
      <div>^</div>
      <div>
        <p>Connect to your git account</p>
        <p>
          Once connected, you can create projects by importing repositories
          under the account
        </p>
      </div>
      <div className="mt-2 flex">
        <OauthPopup
          url={GITHUB_OAUTH_URL}
          onCode={handleCode}
          onClose={() => {}}
          title="Snowball"
          width={1000}
          height={1000}
        >
          <Button className="rounded-full mx-2">Connect to Github</Button>
        </OauthPopup>
        <Button className="rounded-full mx-2">Connect to Gitea</Button>
      </div>
      <ConnectAccountTabPanel />
    </div>
  );
};

export default ConnectAccount;
