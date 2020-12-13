import React, { ChangeEvent, useCallback, useRef } from 'react';

import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Container, Content, AvatarInput } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
    name: string;
    email: string;
    oldPassword: string;
    password: string;
    passwordConfirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = yup.object().shape({
                    name: yup.string().required('Nome obrigatório'),
                    email: yup
                        .string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    oldPassword: yup.string(),
                    password: yup.string().when('oldPassword', {
                        is: val => !!val.length,
                        then: yup.string().required('Campo obrigatório'),
                        otherwise: yup.string(),
                    }),
                    passwordConfirmation: yup
                        .string()
                        .when('oldPassword', {
                            is: val => !!val.length,
                            then: yup.string().required('Campo obrigatório'),
                            otherwise: yup.string(),
                        })
                        .oneOf([yup.ref('password')], 'Confirmação incorreta'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    oldPassword,
                    password,
                    passwordConfirmation,
                } = data;

                const formData = {
                    name,
                    email,
                    ...(oldPassword
                        ? {
                              oldPassword,
                              password,
                              passwordConfirmation,
                          }
                        : {}),
                };

                const response = await api.put('/profile', formData);
                updateUser(response.data);

                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Dados atualizados',
                    description:
                        'Os dados da sua conta foram atualizados com sucesso',
                });
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na atualização',
                    description:
                        'Ocorreu um erro ao atualizar os dados, tente novamente.',
                });
            }
        },
        [addToast, history],
    );

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();

                data.append('avatar', e.target.files[0]);

                api.patch('users/avatar', data).then(response => {
                    updateUser(response.data);
                    addToast({ type: 'success', title: 'Avatar atualizado!' });
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>

            <Content>
                <Form
                    ref={formRef}
                    initialData={{ name: user.name, email: user.email }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatarUrl} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />

                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>
                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" />

                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="oldPassword"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha atual"
                    />

                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Nova senha"
                    />

                    <Input
                        name="passwordConfirmation"
                        icon={FiLock}
                        type="password"
                        placeholder="Confirmar senha"
                    />

                    <Button type="submit">Confirmar alterações</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
