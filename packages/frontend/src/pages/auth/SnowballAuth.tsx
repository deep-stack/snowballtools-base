import { snowball } from 'utils/use-snowball';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { useEffect, useState } from 'react';
import { Done } from './Done';

type Screen = 'login' | 'signup' | 'success';

const DASHBOARD_URL = '/';

export const SnowballAuth = () => {
  const path = window.location.pathname;
  const [screen, setScreen] = useState<Screen>(
    path === '/login' ? 'login' : 'signup',
  );

  useEffect(() => {
    if (snowball.session) {
      window.location.href = DASHBOARD_URL;
    }
  }, []);

  useEffect(() => {
    if (path === '/login') {
      setScreen('login');
    } else if (path === '/signup') {
      setScreen('signup');
    }
  }, [path]);

  if (screen === 'signup') {
    return (
      <SignUp
        onDone={() => {
          setScreen('success');
        }}
      />
    );
  }
  if (screen === 'login') {
    return (
      <Login
        onDone={() => {
          setScreen('success');
        }}
      />
    );
  }
  if (screen === 'success') {
    return <Done continueTo={DASHBOARD_URL} />;
  }
};
