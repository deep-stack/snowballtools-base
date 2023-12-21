import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Option, Select } from '@material-tailwind/react';

import SearchBar from '../../../SearchBar';
import DatePicker from '../../../DatePicker';

export enum StatusOptions {
  ALL_STATUS = 'All status',
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

export interface FilterValue {
  searchedBranch: string;
  status: string;
  updateAtRange?: DateRange;
}

interface FilterFormProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FilterForm = ({ value, onChange }: FilterFormProps) => {
  const [searchedBranch, setSearchedBranch] = useState(value.searchedBranch);
  const [selectedStatus, setSelectedStatus] = useState(value.status);
  const [dateRange, setDateRange] = useState<DateRange>();

  useEffect(() => {
    onChange({
      searchedBranch,
      status: selectedStatus,
      updateAtRange: dateRange,
    });
  }, [searchedBranch, selectedStatus, dateRange]);

  useEffect(() => {
    setSearchedBranch(value.searchedBranch);
    setSelectedStatus(value.status);
    setDateRange(value.updateAtRange);
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
        <DatePicker mode="range" selected={dateRange} onSelect={setDateRange} />
      </div>
      <div className="col-span-1">
        <Select
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value!)}
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
