import { Button } from '../../shared/Button';
import { useWalletConnectClient } from 'context/WalletConnectContext';
import { Select, Option } from '@snowballtools/material-tailwind-react-fork';
import { useGQLClient } from 'context/GQLClientContext';
import { useCallback, useEffect, useState } from 'react';

const TEST_AMOUNT = "10000"

const ConnectWallet = () => {
  const { onConnect, accounts, signClient, session } = useWalletConnectClient();
  const client = useGQLClient();

  const [selectedAccount, setSelectedAccount] = useState<{
    address: string;
    balance?: string;
  }>();
  const [txHash, setTxHash] = useState<string>();
  const [snowballAddress, setSnowballAddress] = useState<string>();

  const handleConnect = async () => {
    await onConnect();
  };

  const cosmosSendTokensHandler = useCallback(
    async (senderAddress: string, amount: string) => {
      if (!signClient || !session || !selectedAccount) {
        console.log({signClient, session, selectedAccount})
        return;
      }

      const chainId = selectedAccount.address.split(':')[1];

      try {
        const result: {
          signature: string;
        } = await signClient.request({
          topic: session.topic,
          chainId: `cosmos:${chainId}`,
          request: {
            method: 'cosmos_sendTokens',
            params: [
              {
                from: senderAddress,
                to: snowballAddress,
                value: amount,
              },
            ],
          },
        });
        if (!result) {
          throw new Error('Error completing transaction');
        }

        setTxHash(result.signature);
        console.log(txHash)
      } catch (error: any) {
        throw error;
      }
    },
    [session, signClient, selectedAccount],
  );

  const fetchSnowballAddress = useCallback(async() => {

    const address = await client.getAddress();
    setSnowballAddress(address);

    console.log(address)
  }, [client])

  useEffect(() => {
    fetchSnowballAddress()
  }, [])

  return (
    <>
      {!accounts ? (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      ) : (
        <div>
          <Select
            label="Select Account"
            defaultValue={accounts[0].address}
            onChange={(value) => {
              setSelectedAccount({
                address: value!,
              });
            }}
          >
            {accounts.map((account, index) => (
              <Option key={index} value={account.address}>
                {account.address}
              </Option>
            ))}
          </Select>
          <Button onClick={() => cosmosSendTokensHandler(selectedAccount!.address.split(":")[2], TEST_AMOUNT)}>Pay</Button>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
