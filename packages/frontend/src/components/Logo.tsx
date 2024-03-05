import React from 'react';
import { Link } from 'react-router-dom';
import { Heading } from './shared/Heading';

interface LogoProps {
  orgSlug?: string;
}

export const Logo = ({ orgSlug }: LogoProps) => {
  return (
    <Link to={`/${orgSlug}`}>
      <div className="flex items-center gap-3 px-0 lg:px-2">
        <img
          src="/logo.svg"
          alt="Snowball Logo"
          className="h-10 w-10 rounded-lg"
        />
        <Heading className="text-[24px] font-semibold">Snowball</Heading>
      </div>
    </Link>
  );
};
