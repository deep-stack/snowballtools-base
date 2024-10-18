import { TurnkeyClient, getWebAuthnAttestation } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

import { BASE_URL, PASSKEY_WALLET_RPID, TURNKEY_BASE_URL } from './constants';

// All algorithms can be found here: https://www.iana.org/assignments/cose/cose.xhtml#algorithms
// We only support ES256, which is listed here
const es256 = -7;

export async function subOrganizationIdForEmail(
  email: string,
): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/auth/registration/${email}`);

  // If API returns a non-empty 200, this email maps to an existing user.
  if (res.status == 200) {
    return (await res.json()).subOrganizationId;
  } else if (res.status === 204) {
    return null;
  } else {
    throw new Error(
      `Unexpected response from registration status endpoint: ${res.status}: ${await res.text()}`,
    );
  }
}

/**
 * This signup function triggers a webauthn "create" ceremony and POSTs the resulting attestation to the backend
 * The backend uses Turnkey to create a brand new sub-organization with a new private key.
 * @param email user email
 */
export async function turnkeySignup(email: string) {
  const challenge = generateRandomBuffer();
  const authenticatorUserId = generateRandomBuffer();

  // An example of possible options can be found here:
  // https://www.w3.org/TR/webauthn-2/#sctn-sample-registration
  const attestation = await getWebAuthnAttestation({
    publicKey: {
      rp: {
        id: PASSKEY_WALLET_RPID,
        name: 'Demo Passkey Wallet',
      },
      challenge,
      pubKeyCredParams: [
        {
          // This constant designates the type of credential we want to create.
          // The enum only supports one value, "public-key"
          // https://www.w3.org/TR/webauthn-2/#enumdef-publickeycredentialtype
          type: 'public-key',
          alg: es256,
        },
      ],
      user: {
        id: authenticatorUserId,
        name: email,
        displayName: email,
      },
      authenticatorSelection: {
        requireResidentKey: true,
        residentKey: 'required',
        userVerification: 'preferred',
      },
    },
  });

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      attestation,
      challenge: base64UrlEncode(challenge),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (res.status !== 200) {
    throw new Error(
      `Unexpected response from registration endpoint: ${res.status}: ${await res.text()}`,
    );
  }
}

// In order to know whether the user is logged in for `subOrganizationId`, we make them sign
// a request for Turnkey's "whoami" endpoint.
// The backend will then forward to Turnkey and get a response on whether the stamp was valid.
// If this is successful, our backend will issue a logged in session.
export async function turnkeySignin(subOrganizationId: string) {
  const stamper = new WebauthnStamper({
    rpId: PASSKEY_WALLET_RPID,
  });
  const client = new TurnkeyClient(
    {
      baseUrl: TURNKEY_BASE_URL,
    },
    stamper,
  );

  var signedRequest;
  try {
    signedRequest = await client.stampGetWhoami({
      organizationId: subOrganizationId,
    });
  } catch (e) {
    throw new Error(`Error during webauthn prompt: ${e}`);
  }

  const res = await fetch(`${BASE_URL}/auth/authenticate`, {
    method: 'POST',
    body: JSON.stringify({
      signedWhoamiRequest: signedRequest,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (res.status !== 200) {
    throw new Error(
      `Unexpected response from authentication endpoint: ${res.status}: ${await res.text()}`,
    );
  }
}

const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

const base64UrlEncode = (challenge: ArrayBuffer): string => {
  return Buffer.from(challenge)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};
