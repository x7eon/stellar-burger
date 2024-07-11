import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedOrdersSelector,
  getFeedIsOrdersRequest
} from '../../services/orders/slice';
import { getFeed } from '../../services/orders/actions';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrdersSelector);
  const isOrdersRequest = useSelector(getFeedIsOrdersRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  if (!orders.length || isOrdersRequest) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
