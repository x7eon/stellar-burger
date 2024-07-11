import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrdersListSelector,
  getIsOrderRequest
} from '../../services/orders/slice';
import { getOrders } from '../../services/orders/actions';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getOrdersListSelector);
  const isOrderRequest = useSelector(getIsOrderRequest);

  if (isOrderRequest) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
