import React from 'react';

import { GitSelect } from '../../../../types/project';

const GitSelectionSection = ({
  gitSelectionHandler,
}: {
  gitSelectionHandler: (git: GitSelect) => void;
}) => {
  return (
    <>
      <div
        className="flex gap-4 border-b-2 border-gray-200 cursor-pointer p-1"
        onClick={() => {
          gitSelectionHandler(GitSelect.GITHUB);
        }}
      >
        <div>^</div>
        <div className="grow">Github</div>
        <div>{'>'}</div>
      </div>
      <div
        className="flex gap-4 border-b-2 border-gray-200 cursor-pointer p-1"
        onClick={() => {}}
      >
        <div>^</div>
        <div className="grow">Gitea</div>
        <div>{'>'}</div>
      </div>
    </>
  );
};

export default GitSelectionSection;
