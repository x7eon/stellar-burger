import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/auth/actions';
import { TRegisterData } from '@api';
import { isAuthSelector } from '../../services/auth/slice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const dataUserRegister: TRegisterData = {
      name: userName,
      email,
      password
    };
    dispatch(registerUser(dataUserRegister));
  };

  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
