import { CloudyFlow } from 'components/CloudyFlow';
import { Login } from './auth/Login';

const AuthPage = () => {
  return (
    <CloudyFlow className="flex flex-col min-h-screen">
      <div className="py-8 relative z-10">
        <div className="flex justify-center items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="snowball logo"
            className="h-10 rounded-xl"
          />
          <div className="text-sky-950 text-2xl font-semibold font-display leading-loose">
            Snowball
          </div>
        </div>
      </div>
      <div className="pb-12 relative z-10 flex-1 flex-center">
        <div className="max-w-[520px] w-full bg-white rounded-xl shadow">
          <Login />
        </div>
      </div>
    </CloudyFlow>
  );
};

export default AuthPage;
