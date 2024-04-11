import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Typography,
  Alert,
  Button,
} from '@snowballtools/material-tailwind-react-fork';

import { useGQLClient } from '../../../../../../../context/GQLClientContext';

const Config = () => {
  const { id, orgSlug } = useParams();
  const client = useGQLClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const primaryDomainName = searchParams.get('name');

  const handleSubmitDomain = async () => {
    if (primaryDomainName === null) {
      toast.error('Cannot resolve domain name');
      return;
    }

    if (id === undefined) {
      toast.error('Cannot find project');
      return;
    }

    const isAdded = await client.addDomain(id, {
      name: primaryDomainName,
    });

    if (isAdded) {
      toast.success('Domain added successfully');
      navigate(`/${orgSlug}/projects/${id}/settings/domains`);
    } else {
      toast.error('Error adding domain');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <Typography variant="h5">Configure DNS</Typography>
        <Typography variant="small">
          Add the following records to your domain.&nbsp;
          <a href="https://www.namecheap.com/" target="_blank" rel="noreferrer">
            <span className="underline">Go to NameCheap</span> ^
          </a>
        </Typography>
      </div>

      <table className="rounded-lg w-3/4 text-blue-gray-600">
        <tbody>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Value</th>
          </tr>
          <tr className="border-b-2 border-gray-300">
            <td className="text-left p-2">A</td>
            <td className="text-left p-2">@</td>
            <td className="text-left p-2">56.49.19.21</td>
          </tr>
          <tr>
            <td className="text-left p-2">CNAME</td>
            <td className="text-left p-2">www</td>
            <td className="text-left p-2">cname.snowballtools.xyz</td>
          </tr>
        </tbody>
      </table>

      <Alert color="blue">
        <i>^</i>It can take up to 48 hours for these updates to reflect
        globally.
      </Alert>
      <Button className="w-fit" color="blue" onClick={handleSubmitDomain}>
        Finish <i>{'>'}</i>
      </Button>
    </div>
  );
};

export default Config;
