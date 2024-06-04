import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleFilledIcon,
  GithubIcon,
  LinkIcon,
  LoaderIcon,
  QuestionMarkRoundFilledIcon,
} from 'components/shared/CustomIcon';
import { GoogleIcon } from 'components/shared/CustomIcon/GoogleIcon';
import { DotBorder } from 'components/shared/DotBorder';
import { WavyBorder } from 'components/shared/WavyBorder';
import { useEffect, useState } from 'react';
import { CreatePasskey } from './CreatePasskey';
import { AppleIcon } from 'components/shared/CustomIcon/AppleIcon';
import { KeyIcon } from 'components/shared/CustomIcon/KeyIcon';
import { useToast } from 'components/shared/Toast';
import { Link } from 'react-router-dom';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { signInWithEthereum } from 'utils/siwe';
import { useSnowball } from 'utils/use-snowball';
import { logError } from 'utils/log-error';

type Provider = 'google' | 'github' | 'apple' | 'email' | 'passkey';

type Props = {
  onDone: () => void;
};

export const Login = ({ onDone }: Props) => {
  const snowball = useSnowball();
  const [error, setError] = useState<string>('');
  const [provider, setProvider] = useState<Provider | false>(false);

  // const loading = snowball.auth.state.loading && provider;
  const loading = provider;
  const { toast } = useToast();

  if (provider === 'email') {
    return <CreatePasskey onDone={onDone} />;
  }

  async function handleSigninRedirect() {
    let wallet: PKPEthersWallet | undefined;
    const { google } = snowball.auth;
    if (google.canHandleOAuthRedirectBack()) {
      setProvider('google');
      console.log('Handling google redirect back');
      try {
        await google.handleOAuthRedirectBack();
        // @ts-ignore
        wallet = await google.getEthersWallet();
        // @ts-ignore
        const result = await signInWithEthereum(1, 'login', wallet);
        if (result.error) {
          setError(result.error);
          setProvider(false);
          wallet = undefined;
          logError(new Error(result.error));
          return;
        }
      } catch (err: any) {
        setError(err.message);
        logError(err);
        setProvider(false);
        return;
      }
    }
    // if (apple.canHandleOAuthRedirectBack()) {
    //   setProvider('apple');
    //   console.log('Handling apple redirect back');
    //   try {
    //     await apple.handleOAuthRedirectBack();
    //     wallet = await apple.getEthersWallet();
    //     const result = await signInWithEthereum(1, 'login', wallet);
    //     if (result.error) {
    //       setError(result.error);
    //       setProvider(false);
    //       wallet = undefined;
    //       return;
    //     }
    //   } catch (err: any) {
    //     setError(err.message);
    //     console.log(err.message, err.name, err.details);
    //     setProvider(false);
    //     return;
    //   }
    // }

    if (wallet) {
      window.location.pathname = '/';
    }
  }

  useEffect(() => {
    handleSigninRedirect();
  }, []);

  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-tight">
          Sign in to Snowball
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />

      <div className="self-stretch p-4 xs:p-6 flex-col justify-center items-center gap-8 flex">
        <div className="self-stretch p-5 bg-slate-50 rounded-xl shadow flex-col justify-center items-center gap-6 flex">
          <div className="self-stretch flex-col justify-center items-center gap-4 flex">
            <KeyIcon />
            <div className="self-stretch flex-col justify-center items-center gap-2 flex">
              <div className="self-stretch text-center text-sky-950 text-lg font-medium font-display leading-normal">
                Got a Passkey?
              </div>
              <div className="self-stretch text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
                Use it to sign in securely without using a password.
              </div>
            </div>
          </div>
          <div className="self-stretch justify-center items-stretch xxs:items-center gap-3 flex flex-col xxs:flex-row">
            <Button
              as="a"
              leftIcon={<QuestionMarkRoundFilledIcon />}
              variant={'tertiary'}
              target="_blank"
              href="https://safety.google/authentication/passkey/"
            >
              Learn more
            </Button>
            <Button
              rightIcon={
                loading && loading === 'passkey' ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <ArrowRightCircleFilledIcon height="16" />
                )
              }
              className="flex-1"
              disabled={!!loading}
              onClick={async () => {
                setProvider('passkey');
              }}
            >
              Sign In with Passkey
            </Button>
          </div>

          <div className="h-5 justify-center items-center gap-2 inline-flex">
            <div className="text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
              Lost your passkey?
            </div>
            <div className="justify-center items-center gap-1.5 flex">
              <button className="text-sky-950 text-sm font-normal font-['Inter'] underline leading-tight">
                Recover account
              </button>
              <LinkIcon />
            </div>
          </div>
        </div>

        <div className="self-stretch justify-start items-center gap-8 inline-flex">
          <DotBorder className="flex-1" />
          <div className="text-center text-slate-400 text-xs font-normal font-['JetBrains Mono'] leading-none">
            OR
          </div>
          <DotBorder className="flex-1" />
        </div>

        <div className="self-stretch flex-col justify-center  items-center gap-3 flex">
          <Button
            leftIcon={<GoogleIcon />}
            rightIcon={
              loading && loading === 'google' ? (
                <LoaderIcon className="animate-spin" />
              ) : null
            }
            onClick={() => {
              setProvider('google');
              snowball.auth.google.startOAuthRedirect();
            }}
            className="flex-1 self-stretch"
            variant={'tertiary'}
            disabled={!!loading}
          >
            Continue with Google
          </Button>

          <Button
            leftIcon={<GithubIcon />}
            rightIcon={
              loading && loading === 'github' ? (
                <LoaderIcon className="animate-spin" />
              ) : null
            }
            onClick={async () => {
              setProvider('github');
              await new Promise((resolve) => setTimeout(resolve, 800));
              setProvider(false);
              toast({
                id: 'coming-soon',
                title: 'Sign-in with GitHub is coming soon!',
                variant: 'info',
                onDismiss() {},
              });
            }}
            className="flex-1 self-stretch"
            variant={'tertiary'}
            disabled={!!loading}
          >
            Continue with GitHub
          </Button>

          <Button
            leftIcon={<AppleIcon />}
            rightIcon={
              loading && loading === 'apple' ? (
                <LoaderIcon className="animate-spin text-white" />
              ) : null
            }
            onClick={async () => {
              setProvider('apple');
              // snowball.auth.apple.startOAuthRedirect();
              await new Promise((resolve) => setTimeout(resolve, 800));
              setProvider(false);
              toast({
                id: 'coming-soon',
                title: 'Sign-in with Apple is coming soon!',
                variant: 'info',
                onDismiss() {},
              });
            }}
            className={`flex-1 self-stretch border-black enabled:bg-black text-white ${
              loading && loading === 'apple' ? 'disabled:bg-black' : ''
            }`}
            variant={'tertiary'}
            disabled={!!loading}
          >
            Continue with Apple
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {error && (
            <div className="justify-center items-center gap-2 inline-flex">
              <div className="text-red-500 text-sm">Error: {error}</div>
            </div>
          )}

          <div className="h-5 justify-center items-center gap-2 inline-flex">
            <div className="text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
              Don't have an account?
            </div>
            <div className="justify-center items-center gap-1.5 flex">
              <Link
                to="/signup"
                className="text-sky-950 text-sm font-normal font-['Inter'] underline leading-tight"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
