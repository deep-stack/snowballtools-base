import React from 'react';

const Card = () => {
  return (
    <div className="h-30 bg-white border border-gray-200 rounded-lg shadow grid grid-cols-1 grid-rows-2">
      <div className="flex gap-2 p-2 items-center">
        <div className="w-10 flex items-center">^</div>
        <div className="flex-1">
          <p className="tracking-tight text-sm text-gray-750">iglotools</p>
          <p className="text-sm text-gray-400">iglotools.com</p>
        </div>
        <div className="p-2 self-start">...</div>
      </div>
      <div className="border-slate-200 border-t-2 border-solid p-4 text-gray-500 text-xs">
        <p>Hello world</p>
        <p>3 day ago main</p>
      </div>
    </div>
  );
};

export default Card;
