import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Alert, Button } from '@material-tailwind/react';

const Config = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <Typography variant="h5">Configure DNS</Typography>
        <Typography variant="small">
          Add the following records to your domain
        </Typography>
      </div>

      <table className="rounded-lg w-3/4 text-blue-gray-600">
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
      </table>

      <Alert color="blue">
        <i>^</i>It can take up to 48 hours for these updates to reflect
        globally.
      </Alert>

      <Link to={`/projects/${id}`}>
        <Button className="w-fit" color="blue">
          Finish <i>{'>'}</i>
        </Button>
      </Link>
    </div>
  );
};

export default Config;
