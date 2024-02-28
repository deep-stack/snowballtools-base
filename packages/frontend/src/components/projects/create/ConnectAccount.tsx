import React from 'react';
import OauthPopup from 'react-oauth-popup';

import { useGQLClient } from '../../../context/GQLClientContext';
import { Button } from 'components/shared/Button';
import {
  GitIcon,
  EllipsesIcon,
  SnowballIcon,
  GithubIcon,
  GitTeaIcon,
} from 'components/shared/CustomIcon';

const SCOPES = 'repo user';
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${
  process.env.REACT_APP_GITHUB_CLIENT_ID
}&scope=${encodeURIComponent(SCOPES)}`;

interface ConnectAccountInterface {
  onAuth: (token: string) => void;
}

const ConnectAccount: React.FC<ConnectAccountInterface> = ({
  onAuth: onToken,
}: ConnectAccountInterface) => {
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
    <div className="bg-gray-100 flex flex-col p-4 gap-7 justify-center items-center text-center text-sm h-full rounded-2xl">
      <div className="flex flex-col items-center max-w-[420px]">
        {/** Icons */}
        <div className="w-52 h-16 justify-center items-center gap-4 inline-flex mb-7">
          <div className="relative w-16 h-16 bg-controls-secondary rounded-2xl shadow-inner border border-b-[3px] border-border-interactive border-opacity-10 justify-center items-center gap-2.5 inline-flex">
            <div className="bottom-0 absolute w-[37px] h-px bg-gradient-to-r from-gray-0/0 via-gray-0/50 to-gray-0/0" />
            <GitIcon />
          </div>
          <EllipsesIcon className="items-center gap-1.5 flex" />
          <div className="relative w-16 h-16 bg-blue-400 rounded-2xl shadow-inner border border-b-[3px] border-border-interactive border-opacity-10 justify-center items-center gap-2.5 flex">
            <div className="bottom-0 absolute w-[37px] h-px bg-gradient-to-r from-gray-0/0 via-gray-0/50 to-gray-0/0" />
            <SnowballIcon />
          </div>
        </div>
        {/** Text */}
        <div className="flex flex-col gap-1.5 mb-6">
          <h1 className="text-center text-slate-900 text-xl font-medium leading-7">
            Connect to your Git account
          </h1>
          <p className="text-center text-elements-mid-em">
            Once connected, you can import a repository from your account or
            start with one of our templates.
          </p>
        </div>
        {/** CTA Buttons */}
        <div className="mt-2 flex flex-col w-full sm:w-auto sm:flex-row gap-3">
          <OauthPopup
            url={GITHUB_OAUTH_URL}
            onCode={handleCode}
            onClose={() => {}}
            title="Snowball"
            width={1000}
            height={1000}
          >
            <Button
              className="w-full sm:w-auto"
              leftIcon={<GithubIcon />}
              variant="tertiary"
            >
              Connect to GitHub
            </Button>
          </OauthPopup>
          <Button
            className="w-full sm:w-auto"
            leftIcon={<GitTeaIcon />}
            variant="tertiary"
          >
            Connect to GitTea
          </Button>
        </div>
      </div>

      {/* TODO: Add ConnectAccountTabPanel */}
      {/* <div className="rounded-l shadow p-2 flex-col justify-start items-start gap-2 inline-flex">
        <ConnectAccountTabPanel />
      </div> */}
    </div>
  );
};

export default ConnectAccount;
