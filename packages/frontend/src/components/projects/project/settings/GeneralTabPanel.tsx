import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import { Button } from '@material-tailwind/react';
import { Input } from '@material-tailwind/react';

const PROJECT_ID = '62f87575-7a2b-4951-8156-9f9821j380d';

const CopyIcon = ({ value }: { value: string }) => {
  return (
    <span
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Project ID copied');
      }}
      className="cursor-pointer"
    >
      ^
    </span>
  );
};

const GeneralTabPanel = () => {
  const { handleSubmit, register } = useForm({
    defaultValues: {
      appName: 'iglootools',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-4">
        <h4>Project info</h4>
      </div>
      <div className="my-2 w-3/5">
        <label
          htmlFor="input"
          className="block text-sm font-medium text-gray-800"
        >
          App name
        </label>
        <Input
          id="input"
          variant="outlined"
          // TODO: Debug issue: https://github.com/creativetimofficial/material-tailwind/issues/427
          crossOrigin={undefined}
          size="md"
          {...register('appName')}
        />
      </div>
      <div className="my-2 w-3/5">
        <label
          htmlFor="input"
          className="block text-sm font-medium text-gray-800"
        >
          Description (Optional)
        </label>
        <Input
          id="input"
          variant="outlined"
          crossOrigin={undefined}
          size="md"
          {...register('description')}
        />
      </div>
      <div className="my-2 w-3/5">
        <label
          htmlFor="input"
          className="block text-sm font-medium text-gray-800"
        >
          Project ID
        </label>
        <Input
          id="input"
          crossOrigin={undefined}
          variant="outlined"
          value={PROJECT_ID}
          size="md"
          disabled
          icon={<CopyIcon value={PROJECT_ID} />}
        />
      </div>
      <div>
        <Button type="submit" variant="gradient" size="sm">
          Save
        </Button>
      </div>
      <Toaster />
    </form>
  );
};

export default GeneralTabPanel;
