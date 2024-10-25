import { useMemo, useState, useCallback } from 'react';
import { Select, Option } from '@snowballtools/material-tailwind-react-fork';
import { Button } from '../../shared/Button';
import { useWalletConnectClient } from 'context/WalletConnectContext';
import { useGQLClient } from 'context/GQLClientContext';

const ConnectWallet = ({ numProviders }: { numProviders: number }) => {
  const { onConnect, accounts, signClient, session } = useWalletConnectClient();
  const client = useGQLClient();

  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [isTxValid, setIsTxValid] = useState<boolean>(false);

  const amount = useMemo(() => numProviders * 10000, [numProviders]);

  const handleConnect = async () => {
    await onConnect();
  };

  const verifyTx = async (
    senderAddress: string,
    txHash: string,
  ): Promise<boolean> => {
    const isValid = await client.verifyTx(
      txHash,
      `${amount.toString()}alnt`,
      senderAddress,
    );
    return isValid;
  };

  const cosmosSendTokensHandler = useCallback(
    async (selectedAccount: string) => {
      if (!signClient || !session || !selectedAccount) {
        return;
      }

      const chainId = selectedAccount.split(':')[1];
      const senderAddress = selectedAccount.split(':')[2];
      const snowballAddress = await client.getAddress();

      try {
        const result: { signature: string } = await signClient.request({
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

        const isValid = await verifyTx(senderAddress, result.signature);
        setIsTxValid(isValid);
      } catch (error: any) {
        throw error;
      }
    },
    [session, signClient, selectedAccount, amount],
  );

  return (
    <div className="p-4 bg-slate-100 rounded-lg mb-6">
      {!accounts ? (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      ) : isTxValid ? (
        <div className="mt-4 text-green-600">Tx successful!</div>
      ) : (
        <div>
          <Select
            label="Select Account"
            defaultValue={accounts[0].address}
            onChange={(value) => {
              setSelectedAccount(value);
            }}
          >
            {accounts.map((account, index) => (
              <Option key={index} value={account.address}>
                {account.address}
              </Option>
            ))}
          </Select>
          <Button
            onClick={() => cosmosSendTokensHandler(selectedAccount || '')}
          >
            Pay
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
