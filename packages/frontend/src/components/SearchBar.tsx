import React from 'react';
import { useForm } from 'react-hook-form';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { watch, register } = useForm({
    defaultValues: {
      search: '',
    },
  });
  const searchValue = watch('search');
  onSearch(searchValue);

  return (
    <div className="w-full flex">
      <div className="text-gray-300">^</div>
      <input
        {...register('search')}
        type="text"
        placeholder="Search"
        className="grow text-gray-700 border-none focus:outline-none text-xs"
      />
    </div>
  );
};

export default SearchBar;
