import React, { useEffect, useState } from 'react';

import { Option, Select } from '@material-tailwind/react';

import SearchBar from '../../../SearchBar';

export enum StatusOptions {
  ALL_STATUS = 'All status',
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

interface FilterValue {
  searchedBranch: string;
  status: string;
}

interface FilterFormProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FilterForm = ({ value, onChange }: FilterFormProps) => {
  const [searchedBranch, setSearchedBranch] = useState(value.searchedBranch);
  const [selectedStatus, setSelectedStatus] = useState(value.status);

  useEffect(() => {
    onChange({
      searchedBranch,
      status: selectedStatus,
    });
  }, [searchedBranch, selectedStatus]);

  useEffect(() => {
    setSearchedBranch(value.searchedBranch);
    setSelectedStatus(value.status);
  }, [value]);

  return (
    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
      <div className="col-span-2">
        <SearchBar
          placeholder="Search branches"
          value={searchedBranch}
          onChange={(event) => setSearchedBranch(event.target.value)}
        />
      </div>
      <div className="col-span-1">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full focus:border-blue-300 focus:outline-none focus:shadow-outline-blue"
          placeholder="All time"
        />
      </div>
      <div className="col-span-1">
        <Select
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value!)}
          label="Select Version"
        >
          {Object.values(StatusOptions).map((status) => (
            <Option
              className={status === selectedStatus ? 'hidden' : ''}
              key={status}
              value={status}
            >
              ^ {status}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default FilterForm;
