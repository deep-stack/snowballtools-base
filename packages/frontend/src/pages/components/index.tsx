import React from 'react';

const Page = () => {
  return (
    <div className="relative h-full min-h-full">
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-20 py-20">
        <h1 className="text-4xl font-bold">Manual Storybook</h1>
        <p className="mt-4 text-lg text-center text-gray-500">
          Get started by editing{' '}
          <code className="p-2 font-mono text-sm bg-gray-100 rounded-md">
            packages/frontend/src/pages/components/index.tsx
          </code>
        </p>
        <div className="w-full h border border-gray-200 px-20 my-10" />

        {/* Insert Components here */}
        <div className="flex flex-col gap-10 items-center justify-between">
          <h1 className="text-2xl font-bold">Component A</h1>

          <div className="flex flex-row gap-10 items-center justify-center">
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
          </div>

          <div className="flex flex-row gap-10 items-center justify-center">
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
            <div className="h-20 w-40 bg-red-400 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
