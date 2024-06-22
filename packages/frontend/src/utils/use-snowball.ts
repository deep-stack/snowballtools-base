import { useEffect, useState } from 'react';
import { Snowball, SnowballChain } from '@snowballtools/js-sdk';
import {
  // LitAppleAuth,
  LitGoogleAuth,
  LitPasskeyAuth,
} from '@snowballtools/auth-lit';
import { VITE_LIT_RELAY_API_KEY } from './constants';

export const snowball = Snowball.withAuth({
  google: LitGoogleAuth.configure({
    litRelayApiKey: VITE_LIT_RELAY_API_KEY!,
  }),
  // apple: LitAppleAuth.configure({
  //   litRelayApiKey: VITE_LIT_RELAY_API_KEY!,
  // }),
  passkey: LitPasskeyAuth.configure({
    litRelayApiKey: VITE_LIT_RELAY_API_KEY!,
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
