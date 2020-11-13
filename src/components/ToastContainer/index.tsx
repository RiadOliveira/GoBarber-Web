import React from 'react';
import { useTransition } from 'react-spring';
import Toast from '../Toast';

import { Container } from './styles';
import { ToastMessage } from '../../hooks/toast';

interface ToastProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastProps> = ({ messages }) => {
    const messagesWithTransitions = useTransition(
        messages,
        message => message.id,
        {
            from: { right: '-120%' },
            enter: { right: '0%' },
            leave: { right: '-120%' },
        },
    );

    return (
        <Container>
            {messagesWithTransitions.map(({ item, key, props }) => (
                <Toast style={props} key={key} message={item} />
            ))}
        </Container>
    );
};

export default ToastContainer;
