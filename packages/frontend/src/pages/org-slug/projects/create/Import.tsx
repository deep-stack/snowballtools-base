import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import assert from 'assert';

import Deploy from '../../../../components/projects/create/Deploy';
import { useGQLClient } from '../../../../context/GQLClientContext';

const Import = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  assert(projectId);

  const [repoName, setRepoName] = useState<string>('');
  const client = useGQLClient();

  useEffect(() => {
    const fetchRepo = async () => {
      const { project } = await client.getProject(projectId);
      assert(project);

      setRepoName(project.repository);
    };

    fetchRepo();
  }, [projectId]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-5/6 my-4 bg-gray-200 rounded-xl p-6">
        <div>^</div>
        <div className="grow">{repoName}</div>
      </div>
      <div className="w-5/6 p-6">
        <Deploy />
      </div>
    </div>
  );
};

export default Import;
