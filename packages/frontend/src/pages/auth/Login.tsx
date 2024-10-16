import { Button } from 'components/shared/Button';
import {
  LoaderIcon,
} from 'components/shared/CustomIcon';
import { GoogleIcon } from 'components/shared/CustomIcon/GoogleIcon';
import { WavyBorder } from 'components/shared/WavyBorder';
import { useEffect, useState } from 'react';
import { CreatePasskey } from './CreatePasskey';
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
