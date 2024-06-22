import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleFilledIcon,
  LoaderIcon,
} from 'components/shared/CustomIcon';
import { WavyBorder } from 'components/shared/WavyBorder';
import { VerifyCodeInput } from 'components/shared/VerifyCodeInput';
import { verifyAccessCode } from 'utils/accessCode';

type AccessMethod = 'accesscode' | 'passkey';

type Err = { type: AccessMethod; message: string };

type AccessCodeProps = {
  onCorrectAccessCode: () => void;
};

export const AccessCode: React.FC<AccessCodeProps> = ({
  onCorrectAccessCode,
}) => {
  const [accessCode, setAccessCode] = useState('     ');
  const [error, setError] = useState<Err | null>();
  const [accessMethod, setAccessMethod] = useState<AccessMethod | false>(false);

  async function validateAccessCode() {
    setAccessMethod('accesscode');
    try {
      const isValidAccessCode = await verifyAccessCode(accessCode);

      // add a pause for ux
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (isValidAccessCode) {
        localStorage.setItem('accessCode', accessCode);
        onCorrectAccessCode();
      } else {
        setError({
          type: 'accesscode',
          message: 'Invalid access code',
        });
      }
    } catch (err: any) {
      setError({ type: 'accesscode', message: err.message });
    }
  }

  const loading = accessMethod;
  const isValidAccessCodeLength = accessCode.trim().length === 5;

  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-tight">
          Access Code
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />
      <div className="self-stretch p-4 xs:p-6 flex-col justify-center items-center gap-8 flex">
        <div className="self-stretch flex-col gap-8 flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <VerifyCodeInput
              loading={!!loading}
              code={accessCode}
              setCode={setAccessCode}
              submitCode={validateAccessCode}
            />
          </div>
          <Button
            rightIcon={
              loading && loading === 'accesscode' ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <ArrowRightCircleFilledIcon height="16" />
              )
            }
            onClick={validateAccessCode}
            variant={'secondary'}
            disabled={!accessCode || !isValidAccessCodeLength || !!loading}
          >
            Submit
          </Button>
          {error && error.type === 'accesscode' && (
            <div className="flex flex-col gap-3">
              <div className="justify-center items-center gap-2 inline-flex">
                <div className="text-red-500 text-sm">
                  Error: {error.message}.{' '}
                  <a href="/signup" className="underline">
                    Try again?
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
