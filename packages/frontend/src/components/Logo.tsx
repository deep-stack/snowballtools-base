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
          className="lg:h-10 lg:w-10 h-8 w-8 rounded-lg"
        />
        <Heading className="lg:text-[24px] text-[19px] font-semibold">
          Snowball
        </Heading>
      </div>
    </Link>
  );
};
