import React from 'react';
import { useParams } from 'react-router-dom';

const Project = () => {
  const { id } = useParams();

  return <div className="bg-white rounded-3xl h-full">Project page: {id}</div>;
};

export default Project;
