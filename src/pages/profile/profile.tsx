import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/auth/slice';
import { useDispatch } from '../../services/store';
import { updateUserData } from '../../services/auth/actions';
import { isAuthRequestSelector } from '../../services/auth/slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();
  const isUserUpdateRequest = useSelector(isAuthRequestSelector);

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserData(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {isUserUpdateRequest ? (
        <Preloader />
      ) : (
        <ProfileUI
          formValue={formValue}
          isFormChanged={isFormChanged}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
};
