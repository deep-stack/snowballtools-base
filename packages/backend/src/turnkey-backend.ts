import { Turnkey, TurnkeyApiTypes } from '@turnkey/sdk-server';

// Default path for the first Ethereum address in a new HD wallet.
// See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki, paths are in the form:
//     m / purpose' / coin_type' / account' / change / address_index
// - Purpose is a constant set to 44' following the BIP43 recommendation.
// - Coin type is set to 60 (ETH) -- see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// - Account, Change, and Address Index are set to 0
import { DEFAULT_ETHEREUM_ACCOUNTS } from '@turnkey/sdk-server';
import { getConfig } from './utils';
import { Service } from './service';

type TAttestation = TurnkeyApiTypes['v1Attestation'];

type CreateUserParams = {
  userName: string;
  userEmail: string;
  challenge: string;
  attestation: TAttestation;
};

export async function createUser(
  service: Service,
  { userName, userEmail, challenge, attestation }: CreateUserParams,
) {
  try {
    if (await service.getUserByEmail(userEmail)) {
      throw new Error(`User already exists: ${userEmail}`);
    }

    const config = await getConfig();
    const turnkey = new Turnkey(config.turnkey);

    const apiClient = turnkey.api();

    const walletName = `Default ETH Wallet`;

    const createSubOrgResponse = await apiClient.createSubOrganization({
      subOrganizationName: `Default SubOrg for ${userEmail}`,
      rootQuorumThreshold: 1,
      rootUsers: [
        {
          userName,
          userEmail,
          apiKeys: [],
          authenticators: [
            {
              authenticatorName: 'Passkey',
              challenge,
              attestation,
            },
          ],
        },
      ],
      wallet: {
        walletName: walletName,
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      },
    });

    const subOrgId = refineNonNull(createSubOrgResponse.subOrganizationId);
    const wallet = refineNonNull(createSubOrgResponse.wallet);

    const result = {
      id: wallet.walletId,
      address: wallet.addresses[0],
      subOrgId: subOrgId,
    };
    console.log('Turnkey success', result);

    const user = await service.createUser({
      name: userName,
      email: userEmail,
      subOrgId,
      ethAddress: wallet.addresses[0],
      turnkeyWalletId: wallet.walletId,
    });
    console.log('New user', user);

    return user;
  } catch (e) {
    console.error('Failed to create user:', e);
    throw e;
  }
}

export async function authenticateUser(
  service: Service,
  signedWhoamiRequest: {
    url: string;
    body: any;
    stamp: {
      stampHeaderName: string;
      stampHeaderValue: string;
    };
  },
) {
  try {
    const tkRes = await fetch(signedWhoamiRequest.url, {
      method: 'POST',
      body: signedWhoamiRequest.body,
      headers: {
        [signedWhoamiRequest.stamp.stampHeaderName]:
          signedWhoamiRequest.stamp.stampHeaderValue,
      },
    });
    console.log('AUTH RESULT', tkRes.status);
    if (tkRes.status !== 200) {
      console.log(await tkRes.text());
      return null;
    }
    const orgId = (await tkRes.json()).organizationId;
    const user = await service.getUserBySubOrgId(orgId);
    return user;
  } catch (e) {
    console.error('Failed to authenticate:', e);
    throw e;
  }
}

function refineNonNull<T>(
  input: T | null | undefined,
  errorMessage?: string,
): T {
  if (input == null) {
    throw new Error(errorMessage ?? `Unexpected ${JSON.stringify(input)}`);
  }

  return input;
}
