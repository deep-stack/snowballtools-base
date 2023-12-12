import React from 'react';

const Card = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2 p-2 items-center">
        <div>^</div>
        <div className="grow">
          <p className="text-sm text-gray-750">iglotools</p>
          <p className="text-sm text-gray-400">iglotools.com</p>
        </div>
        <div>...</div>
      </div>
      <div className="border-slate-200 border-t-2 border-solid p-4 text-gray-500 text-xs">
        <p>Hello world</p>
        <p>3 day ago main</p>
      </div>
    </div>
  );
};

export default Card;
