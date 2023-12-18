import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Dropdown from './Dropdown';

const USER_OPTIONS = [
  { value: 'saugatyadav1', label: 'saugatyadav1' },
  { value: 'brad102', label: 'brad102' },
  { value: 'erin20', label: 'erin20' },
];

const CreateRepo = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      framework: 'reactNative',
      repoName: '',
      isPrivate: false,
      account: { value: 'saugatyadav1', label: 'saugatyadav1' },
    },
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-2">
        <h3>Create a repository</h3>
        <p className="text-sm text-gray-400">
          The project will be cloned into this repository
        </p>
      </div>
      <div className="mb-2">
        <h5>Framework</h5>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center w-1/2 border rounded-lg p-2">
            <input
              type="radio"
              {...register('framework')}
              value="reactNative"
              className="h-5 w-5 text-indigo-600 rounded"
            />
            <span className="ml-2">^React Native</span>
          </label>
          <label className="inline-flex items-center w-1/2 border rounded-lg p-2">
            <input
              type="radio"
              {...register('framework')}
              className="h-5 w-5 text-indigo-600 rounded"
              value="expo"
            />
            <span className="ml-2">^Expo</span>
          </label>
        </div>
      </div>
      <div className="mb-2">
        <h5>Git account</h5>
        <div>
          <Controller
            name="account"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                onChange={onChange}
                value={value}
                options={USER_OPTIONS}
              />
            )}
          />
        </div>
      </div>
      <div className="mb-2">
        <h5>Name the repo</h5>
        <div>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
            placeholder=""
            {...register('repoName')}
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="h-5 w-5 text-indigo-600 rounded"
            {...register('isPrivate')}
          />
          <span className="ml-2">Make this repo private</span>
        </label>
      </div>
      <div className="mb-2">
        <button className="bg-blue-500 rounded-xl p-2" type="submit">
          Deploy ^
        </button>
      </div>
    </form>
  );
};

export default CreateRepo;
