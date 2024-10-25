import { Select, Option } from '@snowballtools/material-tailwind-react-fork';
import { Button } from '../../shared/Button';
import { useWalletConnectClient } from 'context/WalletConnectContext';

const ConnectWallet = ({
  onAccountChange,
}: {
  onAccountChange: (selectedAccount: string) => void;
}) => {
  const { onConnect, accounts } = useWalletConnectClient();

  const handleConnect = async () => {
    await onConnect();
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg mb-6">
      {!accounts ? (
        <div>
          <Button type={'button'} onClick={handleConnect}>
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div>
          <Select
            label="Select Account"
            defaultValue={accounts[0].address}
            onChange={(value) => {
              value && onAccountChange(value);
            }}
          >
            {accounts.map((account, index) => (
              <Option key={index} value={account.address}>
                {account.address.split(':')[2]}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
