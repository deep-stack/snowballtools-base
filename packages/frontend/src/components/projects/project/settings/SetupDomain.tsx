import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Input } from '@material-tailwind/react';

const SetupDomain = () => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Typography variant="h3">Setup domain name</Typography>
        <Typography variant="small">
          Add your domain and setup redirects
        </Typography>
      </div>
      <div>
        <Typography variant="lead">Domain name</Typography>
        <Input
          type="text"
          variant="outlined"
          size="lg"
          className="border-2 rounded w-full"
          crossOrigin={''}
        />
      </div>
      <Button className="w-fit" color="blue">
        <Link to={`config`}>
          <i>^</i> Next
        </Link>
      </Button>
    </div>
  );
};

export default SetupDomain;
