import React from 'react';
import {
  Chip,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';

const DomainCard = (props: { domain: string; status: string }) => {
  return (
    <>
      <div className="flex justify-between py-3">
        <div className="flex justify-start gap-1">
          <Typography variant="h6">
            <i>^</i> {props.domain}
          </Typography>
          <Chip
            className=" w-fit"
            value={props.status}
            color="green"
            variant="ghost"
            icon={<i>^</i>}
          />
        </div>

        <div className="flex justify-start gap-1">
          <i id="refresh" className="cursor-pointer w-8 h-8">
            ^
          </i>
          <Menu placement="bottom-end">
            <MenuHandler>
              <button className="border-2 rounded-full w-8 h-8">...</button>
            </MenuHandler>
            <MenuList>
              <MenuItem className="text-black">^ Edit domain</MenuItem>
              <MenuItem className="text-red-500">^ Delete domain</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Typography variant="small">Production</Typography>
    </>
  );
};

export default DomainCard;
