import { Button } from 'components/shared/Button';
import { LoaderIcon } from 'components/shared/CustomIcon';
import { KeyIcon } from 'components/shared/CustomIcon/KeyIcon';
import { InlineNotification } from 'components/shared/InlineNotification';
import { Input } from 'components/shared/Input';
import { WavyBorder } from 'components/shared/WavyBorder';
import { useState } from 'react';
import { IconRight } from 'react-day-picker';
import { useSnowball } from 'utils/use-snowball';

type Props = {
  onDone: () => void;
};

export const CreatePasskey = ({}: Props) => {
  const snowball = useSnowball();
  const [name, setName] = useState('');

  const auth = snowball.auth.passkey;
  const loading = !!auth.state.loading;

  async function createPasskey() {
    await auth.register(name);
  }

  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="w-16 h-16 p-2 bg-sky-100 rounded-[800px] justify-center items-center gap-2 inline-flex">
          <KeyIcon />
        </div>
        <div>
          <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-loose">
            Create a passkey
          </div>
          <div className="text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
            Passkeys allow you to sign in securely without using passwords.
          </div>
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />
      <div className="p-6 flex-col justify-center items-center gap-8 inline-flex">
        <div className="self-stretch h-36 flex-col justify-center items-center gap-2 flex">
          <div className="self-stretch h-[72px] flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch h-5 px-1 flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-sky-950 text-sm font-normal font-['Inter'] leading-tight">
                Give it a name
              </div>
            </div>
            <Input
              value={name}
              onInput={(e: any) => {
                setName(e.target.value);
              }}
            />
          </div>

          {auth.state.error ? (
            <InlineNotification
              title={auth.state.error.message}
              variant="danger"
            />
          ) : (
            <InlineNotification
              title={`Once you press the "Create passkeys" button, you'll receive a prompt to create the passkey.`}
              variant="info"
            />
          )}
        </div>
        <Button
          rightIcon={
            loading ? <LoaderIcon className="animate-spin" /> : <IconRight />
          }
          className="self-stretch"
          disabled={!name || loading}
          onClick={createPasskey}
        >
          Create Passkey
        </Button>
      </div>
    </div>
  );
};
