import React, { useMemo } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';

import Stepper from '../../../../components/Stepper';
import templateDetails from '../../../../assets/templates.json';

const STEPPER_VALUES = [
  { step: 1, route: '/projects/create/template', label: 'Create repository' },
  { step: 2, route: '/projects/create/template/deploy', label: 'Deploy' },
];

// TODO: Set dynamic route for template and load details from DB
const CreateWithTemplate = () => {
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const template = templateDetails.find(
    (template) => template.id === searchParams.get('templateId'),
  );

  const activeStep = useMemo(
    () =>
      STEPPER_VALUES.find((data) => data.route === location.pathname)?.step ??
      0,
    [location.pathname],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-5/6 my-4 bg-gray-200 rounded-xl p-6">
        <div>^</div>
        <div className="grow">{template?.name}</div>
        {/* TODO: Get template Git link from DB */}
        <div>^snowball-tools/react-native-starter</div>
      </div>
      <div className="grid grid-cols-3 w-5/6 p-6">
        <div>
          <Stepper activeStep={activeStep} stepperValues={STEPPER_VALUES} />
        </div>
        <div className="col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CreateWithTemplate;
