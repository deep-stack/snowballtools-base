import React from 'react';

const SearchBar = () => {
  return (
    <div className="w-full p-2 flex items-center">
      <div className="grid place-items-center h-full w-10 text-gray-300">^</div>
      <input
        type="text"
        placeholder="Search"
        className="h-full w-full text-gray-700 border-none focus:outline-none text-xs"
      />
    </div>
  );
};

export default SearchBar;
