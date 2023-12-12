import React from 'react';

import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

const Projects = () => {
  return (
    <div className="bg-white rounded-3xl h-full">
      <div className="flex p-4">
        <div className="grow">
          <SearchBar onSearch={() => {}} />
        </div>
        <div className="text-gray-300">^</div>
        <div className="text-gray-300">^</div>
        <div className="text-gray-300">^</div>
      </div>
      <hr className="h-px bg-slate-200 border-0" />
      <div className="flex p-4">
        <div className="grow">
          <h3 className="text-gray-750 text-2xl">Projects</h3>
        </div>
        <div>
          {/* TODO: Create button component */}
          <button className="bg-sky-600 text-white text-sm px-4 py-2 border rounded-full">
            Create project
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 p-5">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Projects;
