import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    setValue,
  } = useForm({
    defaultValues: {
      domainName: '',
      isWWW: 'false',
    },
  });

  const [domainStr, setDomainStr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'domainName' && value.domainName) {
        const domainArr = value.domainName.split('www.');
        setDomainStr(domainArr.length > 1 ? domainArr[1] : domainArr[0]);

        if (value.domainName.startsWith('www.')) {
          setValue('isWWW', 'true');
        } else {
          setValue('isWWW', 'false');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      onSubmit={handleSubmit(() => {
        navigate('config');
      })}
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
              label={domainStr}
              crossOrigin={undefined}
              {...register('isWWW')}
              value="false"
              type="radio"
            />
            <Radio
              label={`www.${domainStr}`}
              crossOrigin={undefined}
              {...register('isWWW')}
              value="true"
              type="radio"
            />
          </div>
          <Alert color="blue">
            <i>^</i> For simplicity, we’ll redirect the{' '}
            {watch('isWWW') === 'true'
              ? `non-www variant to www.${domainStr}`
              : `www variant to ${domainStr}`}
            . Redirect preferences can be changed later
          </Alert>
        </div>
      )}

      <Button
        disabled={!isValid}
        className="w-fit"
        color={isValid ? 'blue' : 'gray'}
        type="submit"
      >
        <i>^</i> Next
      </Button>
    </form>
  );
};

export default SetupDomain;
