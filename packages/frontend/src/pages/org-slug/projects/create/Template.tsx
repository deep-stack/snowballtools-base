import React, { useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import templates from '../../../../assets/templates';
import {
  LinkChainIcon,
  TemplateIcon,
  TemplateIconType,
} from 'components/shared/CustomIcon';
import { Heading } from 'components/shared/Heading';
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
      <div className="flex flex-col lg:flex-row justify-between w-5/6 my-4 bg-base-bg-alternate rounded-xl p-6 gap-3 items-start lg:items-center">
        <div className="flex items-center gap-3">
          <TemplateIcon type={template?.icon as TemplateIconType} size={48} />
          <Heading className="font-medium">{template?.name}</Heading>
        </div>
        <div>
          <a
            href={`https://github.com/${template?.repoFullName}`}
            target="_blank"
            rel="noreferrer"
            className="flex gap-1.5 items-center text-sm"
          >
            <LinkChainIcon size={18} />
            <span className="underline">
              {Boolean(template?.repoFullName)
                ? template?.repoFullName
                : 'Template not supported'}
            </span>
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
