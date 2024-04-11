import { LitGoogleAuth } from '@snowballtools/auth-lit';
import { Snowball, SnowballChain } from '@snowballtools/js-sdk';
// import { LinkLitAlchemyLight } from '@snowballtools/link-lit-alchemy-light';

export const DOMAIN = import.meta.env.VITE_DOMAIN || 'localhost';
export const ORIGIN =
  import.meta.env.VITE_VERCEL_ENV === 'production'
    ? `https://${DOMAIN}`
    : `http://${DOMAIN}:3000`;

// prettier-ignore

export const snowball = Snowball.withAuth(
  LitGoogleAuth.configure({
    litReplayApiKey: import.meta.env.VITE_LIT_RELAY_API_KEY!,
  }),
).create({
  initialChain: SnowballChain.sepolia,
});
