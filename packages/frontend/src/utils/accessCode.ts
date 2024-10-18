import { BASE_URL } from './constants';

export async function verifyAccessCode(
  accesscode: string,
): Promise<boolean | null> {
  const res = await fetch(`${BASE_URL}/auth/accesscode`, {
    method: 'POST',
    body: JSON.stringify({
      accesscode,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  // If API returns a non-empty 200, this is a valid access code.
  if (res.status == 200) {
    const isValid = (await res.json()).isValid as boolean;
    console.log('isValid', isValid);
    return isValid;
  } else if (res.status === 204) {
    return null;
  } else {
    throw new Error(
      `Unexpected response from access code endpoint: ${res.status}: ${await res.text()}`,
    );
  }
}
