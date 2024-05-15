import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Heading } from 'components/shared/Heading';
import { InlineNotification } from 'components/shared/InlineNotification';
import { Input } from 'components/shared/Input';
import { Button } from 'components/shared/Button';
import { Radio } from 'components/shared/Radio';

interface SetupDomainFormValues {
  domainName: string;
  isWWW: string;
}

const SetupDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<SetupDomainFormValues>({
    defaultValues: {
      domainName: '',
      isWWW: 'false',
    },
    mode: 'onChange',
  });

  const [domainStr, setDomainStr] = useState<string>('');
  const navigate = useNavigate();
  const isWWWRadioOptions = [
    { label: domainStr, value: 'false' },
    { label: `www.${domainStr}`, value: 'true' },
  ];

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'domainName' && value.domainName) {
        const domainArr = value.domainName.split('www.');
        const cleanedDomain =
          domainArr.length > 1 ? domainArr[1] : domainArr[0];
        setDomainStr(cleanedDomain);

        setValue(
          'isWWW',
          value.domainName.startsWith('www.') ? 'true' : 'false',
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <form
      onSubmit={handleSubmit(() => {
        watch('isWWW') === 'true'
          ? navigate(`config?name=www.${domainStr}`)
          : navigate(`config?name=${domainStr}`);
      })}
      className="flex flex-col gap-6 w-full"
    >
      <div>
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Setup domain name
        </Heading>
        <p className="text-slate-500 text-sm font-normal leading-tight">
          Add your domain and setup redirects
        </p>
      </div>

      <Input
        size="md"
        placeholder="example.com"
        {...register('domainName', {
          required: true,
        })}
        label="Domain name"
      />

      {isValid && (
        <div className="self-stretch flex flex-col gap-4">
          <Heading className="text-sky-950 text-lg font-medium leading-normal">
            Primary domain
          </Heading>
          <Radio
            options={isWWWRadioOptions}
            onValueChange={(value) => setValue('isWWW', value)}
            value={watch('isWWW')}
          />
          <InlineNotification
            variant="info"
            title={`For simplicity, we'll redirect the ${
              watch('isWWW') === 'true'
                ? `non-www variant to www.${domainStr}`
                : `www variant to ${domainStr}`
            }. Redirect preferences can be changed later`}
          />
        </div>
      )}

      <div className="self-stretch">
        <Button disabled={!isValid} type="submit">
          Next
        </Button>
      </div>
    </form>
  );
};

export default SetupDomain;
