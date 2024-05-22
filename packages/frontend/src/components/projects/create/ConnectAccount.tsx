import React from 'react';
import OauthPopup from 'react-oauth-popup';

import { useGQLClient } from '../../../context/GQLClientContext';
import { Button } from '../../shared/Button';
import {
  GitIcon,
  EllipsesIcon,
  SnowballIcon,
  GithubIcon,
  GitTeaIcon,
} from '../../shared/CustomIcon';
import { useToast } from '../../shared/Toast';
import { IconWithFrame } from '../../shared/IconWithFrame';
import { Heading } from '../../shared/Heading';
import { MockConnectGitCard } from './MockConnectGitCard';

const SCOPES = 'repo user';
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${
  import.meta.env.VITE_GITHUB_CLIENT_ID
}&scope=${encodeURIComponent(SCOPES)}`;

interface ConnectAccountInterface {
  onAuth: (token: string) => void;
}

const ConnectAccount: React.FC<ConnectAccountInterface> = ({
  onAuth: onToken,
}: ConnectAccountInterface) => {
  const client = useGQLClient();

  const { toast, dismiss } = useToast();

  const handleCode = async (code: string) => {
    // Pass code to backend and get access token
    const {
      authenticateGitHub: { token },
    } = await client.authenticateGitHub(code);
    onToken(token);
    toast({
      onDismiss: dismiss,
      id: 'connected-to-github',
      title: 'The Git account is connected.',
      variant: 'success',
    });
  };

  // TODO: Use correct height
  return (
    <div className="bg-gray-100 flex flex-col p-4 gap-7 justify-center items-center text-center text-sm h-full rounded-2xl">
      <div className="flex flex-col items-center max-w-[420px]">
        {/** Icons */}
        <div className="w-52 h-16 justify-center items-center gap-4 inline-flex mb-7">
          <IconWithFrame icon={<GitIcon />} />
          <EllipsesIcon className="items-center gap-1.5 flex" />
          <IconWithFrame className="bg-blue-400" icon={<SnowballIcon />} />
        </div>
        {/** Text */}
        <div className="flex flex-col gap-1.5 mb-6">
          <Heading className="text-xl font-medium">
            Connect to your Git account
          </Heading>
          <p className="text-center text-elements-mid-em">
            Once connected, you can import a repository from your account or
            start with one of our templates.
          </p>
        </div>
        {/** CTA Buttons */}
        <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2 sm:gap-3">
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
      <MockConnectGitCard />
      {/* <div className="rounded-l shadow p-2 flex-col justify-start items-start gap-2 inline-flex">
        <ConnectAccountTabPanel />
      </div> */}
    </div>
  );
};

export default ConnectAccount;
