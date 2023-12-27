import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Radio,
  Typography,
  Button,
  Input,
  Alert,
} from '@material-tailwind/react';

const SetupDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm({
    defaultValues: {
      domainName: '',
      isWWW: 'false',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(() => {})}
      className="flex flex-col gap-6 w-full"
    >
      <div>
        <Typography variant="h5">Setup domain name</Typography>
        <Typography variant="small">
          Add your domain and setup redirects
        </Typography>
      </div>

      <div className="w-auto">
        <Typography variant="small">Domain name</Typography>
        <Input
          type="text"
          variant="outlined"
          size="lg"
          crossOrigin={undefined}
          className="w-full"
          {...register('domainName', {
            required: true,
          })}
        />
      </div>

      {isValid && (
        <div>
          <Typography>Primary domain</Typography>
          <div className="flex flex-col gap-3">
            <Radio
              label={watch('domainName')}
              crossOrigin={undefined}
              {...register('isWWW')}
              value="false"
              type="radio"
            />
            <Radio
              label={`www.${watch('domainName')}`}
              crossOrigin={undefined}
              {...register('isWWW')}
              value="true"
              type="radio"
            />
          </div>
          <Alert color="blue">
            <i>^</i> For simplicity, we’ll redirect the www variant to{' '}
            {watch('domainName')}. Redirect preferences can be changed later.
          </Alert>
        </div>
      )}

      <Button
        disabled={!isValid}
        className="w-fit"
        color={isValid ? 'blue' : 'gray'}
        type="submit"
      >
        <Link to="config">
          <i>^</i> Next
        </Link>
      </Button>
    </form>
  );
};

export default SetupDomain;
