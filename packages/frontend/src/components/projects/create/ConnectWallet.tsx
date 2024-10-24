import { Button } from '../../shared/Button';
import { useWalletConnectClient } from 'context/WalletConnectContext';
// import { useGQLClient } from '../../../context/GQLClientContext';
import { Select, Option } from '@snowballtools/material-tailwind-react-fork';

const ConnectWallet = () => {
  const { onConnect, accounts } = useWalletConnectClient();
  // const client = useGQLClient();

  const handleConnect = async () => {
    await onConnect();
    // const snowballaddress = await client.getAddress();
  };

  return (
    <>
      {!accounts ? (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      ) : (
        <Select label="Select Account">
          {accounts.map((account, index) => (
            <Option key={index} value={account.address}>
              {account.address}
            </Option>
          ))}
        </Select>
      )}
    </>
  );
};

export default ConnectWallet;
