import { Link,  useParams, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';

import { Badge } from 'components/shared/Badge';
import { Button } from 'components/shared/Button';
import {
  ArrowLeftCircleFilledIcon,
  QuestionMarkRoundFilledIcon,
} from 'components/shared/CustomIcon';
import { Heading } from 'components/shared/Heading';

import logoAnimation from 'components/../../public/lottie/logo.json';
import { useGQLClient } from 'context/GQLClientContext';
import { Project } from 'gql-client';
import { useEffect, useState } from 'react';

const Id = () => {
  const { id, orgSlug } = useParams();
  const client = useGQLClient();
  const [project, setProject] = useState<Project | null>(null);
  const [searchParams] = useSearchParams();
  const isAuction = searchParams.get('isAuction') === 'true';

  const handleSetupDomain = async () => {
    if (id) {
      // console.log('id', id);
      // console.log('getting project for id', id);
      const project = await client.getProject(id);
      // console.log('project found:', project);
      if (project && project.project) {
        // console.log('project:', project.project);
        setProject(project.project);
      }
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    handleSetupDomain();
  });

  return (
    <>
      {project ? (
        <div className="flex flex-col gap-8 lg:gap-11 max-w-[522px] mx-auto py-6 lg:py-12">
          {/* Icon */}
          <div className="flex justify-center">
            <Lottie animationData={logoAnimation} loop={false} size={40} />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-1.5">
            <Heading as="h3" className="font-medium text-xl">
              {isAuction? 'Auction created successfully.' : 'Project deployment created successfully.'}
            </Heading>
          </div>

          {/* Card */}
          <div className="bg-base-bg-alternate rounded-xl shadow-inset w-full px-1 py-1">
            {/* Trigger question */}
            <div className="flex gap-2 justify-center items-center py-3">
              <div className="h-5 w-5">
                <QuestionMarkRoundFilledIcon size={18} />
              </div>
              <Heading as="h5" className="font-sans font-medium text-sm">
                {`Wondering what's next?`}
              </Heading>
            </div>

            {/* CTA card */}
            <div className="bg-surface-card rounded-xl shadow-card-sm px-4 py-4">
              <div className="flex gap-2">
                <Badge variant="secondary">1</Badge>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <Heading as="h6" className="text-sm font-sans">
                      Add a custom domain
                    </Heading>
                    <p className="text-xs text-elements-low-em font-sans">
                      Make it easy for your visitors to remember your URL with a
                      custom domain.
                    </p>
                  </div>
                  <Button
                    onClick={handleSetupDomain}
                    variant="tertiary"
                    size="sm"
                  >
                    Setup domain
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row justify-center gap-3">
            <div className="w-full lg:w-fit">
              <Link to="/">
                <Button
                  leftIcon={<ArrowLeftCircleFilledIcon />}
                  fullWidth
                  variant="tertiary"
                >
                  Back to projects
                </Button>
              </Link>
            </div>
            <div className="w-full lg:w-fit">
              <Link to={`/${orgSlug}/projects/${id}`}>
                <Button fullWidth variant="primary">
                  View project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Id;
