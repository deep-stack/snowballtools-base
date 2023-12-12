import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface SearchBarProps {
  handler: (searchText: SearchInputs) => void;
  placeholder?: string;
}

interface SearchInputs {
  search: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  handler,
  placeholder = 'Search',
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const onSubmit: SubmitHandler<SearchInputs> = (data) => {
    handler(data);
  };

  return (
    <div className="w-full flex">
      <div className="text-gray-300">^</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('search')}
          type="text"
          placeholder={placeholder}
          className="grow text-gray-700 border-none focus:outline-none text-xs"
        />
      </form>
    </div>
  );
};

export default SearchBar;
