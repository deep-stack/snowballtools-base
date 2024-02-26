import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@material-tailwind/react';

const Id = () => {
  const { id, orgSlug } = useParams();
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <div className="flex justify-center">^</div>
        <div className="flex flex-col items-center my-10">
          <div>
            <h4>Project deployed successfully.</h4>
          </div>
          <div>
            <span>
              Your project has been deployed at{' '}
              <Link to="https://www.iglootools.snowballtools.xyz">
                <span className="text-blue-600">
                  ^ www.iglootools.snowballtools.xyz
                </span>
              </Link>
            </span>
          </div>
        </div>

        <div className="bg-gray-100 rounded border w-full">
          <div className="flex justify-center items-center h-14">
            ^?&nbsp;<h6>Wondering what’s next?</h6>
          </div>
          <div className="bg-white rounded border w-full">
            <div className="flex p-4">
              <div className="w-6"> 1</div>
              <div className="grow">
                <h6>Add a custom domain</h6>
                <p className="text-sm text-gray-500">
                  Make it easy for your visitors to remember your URL with a
                  custom domain.
                </p>
                <div className="my-2">
                  <Button
                    className="rounded-full"
                    variant="outlined"
                    size="sm"
                    placeholder={''}
                  >
                    Setup domain
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-4 gap-2 my-5">
          <div>
            <Link to="/">
              <Button
                className="rounded-full"
                variant="outlined"
                placeholder={''}
              >
                ^Back to projects
              </Button>
            </Link>
          </div>
          <div>
            <Link to={`/${orgSlug}/projects/${id}`}>
              <Button
                className="rounded-full"
                variant="gradient"
                color="blue"
                placeholder={''}
              >
                View project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
