import React, { useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Avatar } from '@material-tailwind/react';

import templates from '../../../../assets/templates';
import { Steps } from 'components/shared/Steps';

// TODO: Set dynamic route for template and load details from DB
const CreateWithTemplate = () => {
  const { orgSlug } = useParams();

  const stepperValues = [
    {
      step: 1,
      route: `/${orgSlug}/projects/create/template`,
      label: 'Create repository',
    },
    {
      step: 2,
      route: `/${orgSlug}/projects/create/template/deploy`,
      label: 'Deploy',
    },
  ];

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const template = templates.find(
    (template) => template.id === searchParams.get('templateId'),
  );

  const activeStep = useMemo(
    () =>
      stepperValues.find((data) => data.route === location.pathname)?.step ?? 0,
    [location.pathname],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-5/6 my-4 bg-gray-200 rounded-xl p-6 items-center">
        <Avatar variant="rounded" src="/gray.png" placeholder={''} />
        <div className="grow px-2">{template?.name}</div>
        <div>
          <a
            href={`https://github.com/${template?.repoFullName}`}
            target="_blank"
            rel="noreferrer"
          >
            ^{' '}
            {Boolean(template?.repoFullName)
              ? template?.repoFullName
              : 'Template not supported'}
          </a>
        </div>
      </div>
      <div className="grid grid-cols-3 w-5/6 p-6">
        <div>
          <Steps currentIndex={activeStep} steps={stepperValues} />
        </div>
        <div className="col-span-2">
          <Outlet context={{ template }} />
        </div>
      </div>
    </div>
  );
};

export default CreateWithTemplate;
