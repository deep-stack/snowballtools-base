import React from 'react';

import CreateRepo from '../../../components/CreateRepo';

const CreateWithTemplate = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-5/6 my-4 bg-gray-200 rounded-xl p-6">
        <div>^</div>
        <div className="grow">React native</div>
        <div>^snowball-tools/react-native-starter</div>
      </div>
      <div className="grid grid-cols-3 w-5/6 p-6">
        <div>
          <div>1 Create repository</div>
          <div>2 Deploy</div>
        </div>
        <div className="col-span-2">
          <CreateRepo />
        </div>
      </div>
    </div>
  );
};

export default CreateWithTemplate;
