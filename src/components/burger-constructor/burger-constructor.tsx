import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorIngredients,
  resetConstructor
} from '../../services/constructor/slice';
import {
  getIsOrderRequest,
  getOrderModalData,
  resetOrderModalData
} from '../../services/orders/slice';
import { postOrder } from '../../services/orders/actions';
import { isAuthSelector } from '../../services/auth/slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorIngredients);
  const orderRequest = useSelector(getIsOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuth = useSelector(isAuthSelector);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredinetsId = constructorItems.ingredients.map((item) => item._id);
    ingredinetsId.unshift(constructorItems.bun._id);
    ingredinetsId.push(constructorItems.bun._id);
    const order = ingredinetsId;

    !isAuth ? navigate('/login') : dispatch(postOrder(order));
  };

  const closeOrderModal = () => {
    dispatch(resetConstructor());
    dispatch(resetOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
