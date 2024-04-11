import React from 'react';
import { useSnowball } from 'utils/use-snowball';

export const SnowballLogin = () => {
  const snowball = useSnowball();
  console.log(snowball);
  return (
    <div className="flex items-center justify-center h-screen bg-snowball-900 snow">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/logo.svg"
          alt="snowball logo"
          className="w-32 h-32 rounded-full mb-4"
        />
      </div>
    </div>
  );
};
