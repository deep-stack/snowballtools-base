import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleFilledIcon,
  GithubIcon,
  LoaderIcon,
} from 'components/shared/CustomIcon';
import { GoogleIcon } from 'components/shared/CustomIcon/GoogleIcon';
import { DotBorder } from 'components/shared/DotBorder';
import { WavyBorder } from 'components/shared/WavyBorder';
import { useEffect, useState } from 'react';
import { useSnowball } from 'utils/use-snowball';
import { CreatePasskey } from './CreatePasskey';
import { Input } from 'components/shared/Input';
import { AppleIcon } from 'components/shared/CustomIcon/AppleIcon';
import { Link } from 'react-router-dom';
import { useToast } from 'components/shared/Toast';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { signInWithEthereum } from 'utils/siwe';
import { logError } from 'utils/log-error';

type Provider = 'google' | 'github' | 'apple' | 'email';

type Err = { type: 'email' | 'provider'; message: string };

type Props = {
  onDone: () => void;
};

export const SignUp = ({ onDone }: Props) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Err | null>();
  const [provider, setProvider] = useState<Provider | false>(false);

  const { toast } = useToast();
  const snowball = useSnowball();

  async function handleSignupRedirect() {
    let wallet: PKPEthersWallet | undefined;
    const { google } = snowball.auth;
    if (google.canHandleOAuthRedirectBack()) {
      setProvider('google');
      try {
        await google.handleOAuthRedirectBack();
        wallet = await google.getEthersWallet();
        const result = await signInWithEthereum(1, 'signup', wallet);
        if (result.error) {
          setError({ type: 'provider', message: result.error });
          setProvider(false);
          wallet = undefined;
          logError(new Error(result.error));
          return;
        }
      } catch (err: any) {
        setError({ type: 'provider', message: err.message });
        setProvider(false);
        logError(err);
        return;
      }
    }
    // if (apple.canHandleOAuthRedirectBack()) {
    //   setProvider('apple');
    //   try {
    //     await apple.handleOAuthRedirectBack();
    //     wallet = await apple.getEthersWallet();
    //     const result = await signInWithEthereum(1, 'signup', wallet);
    //     if (result.error) {
    //       setError({ type: 'provider', message: result.error });
    //       setProvider(false);
    //       wallet = undefined;
    //       return;
    //     }
    //   } catch (err: any) {
    //     setError({ type: 'provider', message: err.message });
    //     setProvider(false);
    //     return;
    //   }
    // }

    if (wallet) {
      onDone();
    }
  }

  useEffect(() => {
    handleSignupRedirect();
  }, []);

  const loading = provider;
  const emailValid = /.@./.test(email);

  if (provider === 'email') {
    return <CreatePasskey onDone={onDone} />;
  }

  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-tight">
          Sign up to Snowball
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />
      <div className="self-stretch p-4 xs:p-6 flex-col justify-center items-center gap-8 flex">
        <div className="self-stretch flex-col justify-center  items-center gap-3 flex">
          <Button
            leftIcon={loading && loading === 'google' ? null : <GoogleIcon />}
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

        {error && error.type === 'provider' && (
          <div className="-mt-3 justify-center items-center inline-flex">
            <div className="text-red-500 text-sm">Error: {error.message}</div>
          </div>
        )}

        <div className="self-stretch justify-start items-center gap-8 inline-flex">
          <DotBorder className="flex-1" />
          <div className="text-center text-slate-400 text-xs font-normal font-['JetBrains Mono'] leading-none">
            OR
          </div>
          <DotBorder className="flex-1" />
        </div>

        <div className="self-stretch flex-col gap-8 flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <div className="text-sky-950 text-sm font-normal font-['Inter'] leading-tight">
              Email
            </div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!loading}
            />
          </div>
          <Button
            rightIcon={<ArrowRightCircleFilledIcon height="16" />}
            onClick={() => {
              setProvider('email');
            }}
            variant={'secondary'}
            disabled={!email || !emailValid || !!loading}
          >
            Continue with Email
          </Button>
          <div className="flex flex-col gap-3">
            {error && error.type === 'email' && (
              <div className="justify-center items-center gap-2 inline-flex">
                <div className="text-red-500 text-sm">
                  Error: {error.message}
                </div>
              </div>
            )}
            <div className="justify-center items-center gap-2 inline-flex">
              <div className="text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
                Already an user?
              </div>
              <div className="justify-center items-center gap-1.5 flex">
                <Link
                  to="/login"
                  className="text-sky-950 text-sm font-normal font-['Inter'] underline leading-tight"
                >
                  Sign in now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
