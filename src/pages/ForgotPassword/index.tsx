import React, { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/toast';

import { Container, Content, AnimationContainer, Background } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

import LogoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            try {
                setLoading(true);
                formRef.current?.setErrors({});

                const schema = yup.object().shape({
                    email: yup
                        .string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('password/forgot', { email: data.email });

                addToast({
                    type: 'success',
                    title: 'E-mail de recuperação enviado',
                    description:
                        'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.',
                });
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na recuperação de senha',
                    description:
                        'Ocorreu um erro ao tentar realizar a recuperação de senha.',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={LogoImg} alt="Logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>

                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default ForgotPassword;
