import React, { useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Avatar } from '@material-tailwind/react';

import Stepper from '../../../../components/Stepper';
import templateDetails from '../../../../assets/templates.json';
import { GIT_TEMPLATE_LINK } from '../../../../constants';

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

  const template = templateDetails.find(
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
        <Avatar variant="square" />
        <div className="grow px-2">{template?.name}</div>
        <div>
          <a href={GIT_TEMPLATE_LINK} target="_blank" rel="noreferrer">
            ^ cerc-io/test-progressive-web-app
          </a>
        </div>
      </div>
      <div className="grid grid-cols-3 w-5/6 p-6">
        <div>
          <Stepper activeStep={activeStep} stepperValues={stepperValues} />
        </div>
        <div className="col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CreateWithTemplate;
