import React, { useState } from 'react';

import { AccessCode } from './AccessCode';
import { SignUp } from './SignUp';

type AccessSignUpProps = {
  onDone: () => void;
};

export const AccessSignUp: React.FC<AccessSignUpProps> = ({ onDone }) => {
  const [isValidAccessCode, setIsValidAccessCode] = useState<boolean>(
    !!localStorage.getItem('accessCode'),
  );

  return isValidAccessCode ? (
    <SignUp onDone={onDone} />
  ) : (
    <AccessCode onCorrectAccessCode={() => setIsValidAccessCode(true)} />
  );
};
