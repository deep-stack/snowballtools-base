import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, IconButton } from '@material-tailwind/react';

import Stepper from '../../../../components/Stepper';
import SetupDomain from '../../../../components/projects/project/settings/SetupDomain';

const AddDomain = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stepperValues = [
    {
      step: 1,
      route: `/projects/${id}/domain/add`,
      label: 'Setup',
    },
    {
      step: 2,
      route: `/projects/${id}/domain/add/config`,
      label: 'Configure DNS',
    },
  ];

  const activeStep = useMemo(
    () =>
      stepperValues.find((data) => data.route === location.pathname)?.step ?? 0,
    [location.pathname],
  );

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Typography variant="h3">Add Domain</Typography>

        <IconButton
          className="rounded-full"
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          X
        </IconButton>
      </div>

      <div className=" w-2/3 mx-auto">
        <div className="bg-blue-gray-50 rounded-lg mt-6 mb-10">
          <div className="flex justify-start gap-3 p-5">
            <i className="bg-gray-100 w-12 h-12 rounded-lg">^</i>
            <Typography className="my-auto w-1/3" variant="h5">
              Project Name
            </Typography>
          </div>
        </div>

        <div className="flex justify-start gap-3">
          <Stepper activeStep={activeStep} stepperValues={stepperValues} />
          <SetupDomain />
        </div>
      </div>
    </div>
  );
};

export default AddDomain;
