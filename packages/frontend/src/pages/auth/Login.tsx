import { WavyBorder } from 'components/shared/WavyBorder';

export const Login = () => {
  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-tight">
          Sign in to Snowball
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />

      <div className="self-stretch p-4 xs:p-6 flex-col justify-center items-center gap-8 flex">
        <div className="self-stretch flex-col justify-center  items-center gap-3 flex">
          <w3m-button />
        </div>
      </div>
    </div>
  );
};
