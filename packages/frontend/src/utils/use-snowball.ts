import { useEffect, useState } from 'react';
import { Snowball, SnowballChain } from '@snowballtools/js-sdk';
import { LitGoogleAuth, LitPasskeyAuth } from '@snowballtools/auth-lit';

export const snowball = Snowball.withAuth({
  google: LitGoogleAuth.configure({
    litRelayApiKey: import.meta.env.VITE_LIT_RELAY_API_KEY!,
  }),
  passkey: LitPasskeyAuth.configure({
    litRelayApiKey: import.meta.env.VITE_LIT_RELAY_API_KEY!,
  }),
}).create({
  initialChain: SnowballChain.sepolia,
});

export function useSnowball() {
  const [state, setState] = useState(100);

  useEffect(() => {
    // Subscribe and directly return the unsubscribe function
    return snowball.subscribe(() => setState(state + 1));
  }, [state]);

  return snowball;
}
