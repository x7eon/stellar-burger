import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';
import { useLocation, useParams } from 'react-router-dom';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(
  ({ title, onClose, children, ...rest }) => {
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        e.key === 'Escape' && onClose();
      };

      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }, [onClose]);

    const { pathname } = useLocation();
    const { number } = useParams();

    return ReactDOM.createPortal(
      <ModalUI
        title={
          pathname.includes('feed') || pathname.includes('profile/')
            ? `${title} #${number}`
            : title
        }
        onClose={onClose}
        {...rest}
      >
        {children}
      </ModalUI>,
      modalRoot as HTMLDivElement
    );
  }
);
