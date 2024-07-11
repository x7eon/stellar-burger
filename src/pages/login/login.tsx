import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/auth/actions';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userDataAuth: TLoginData = {
      email,
      password
    };
    if (!userDataAuth.email || !userDataAuth.password) {
      return;
    }
    dispatch(loginUser(userDataAuth));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
