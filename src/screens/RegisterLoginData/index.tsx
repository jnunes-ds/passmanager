import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useForm } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import {
  Container,
  HeaderTitle,
  Form
} from './styles';
import { useStorageData } from '../../hooks/storageData';

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Título é obrigatório!'),
  email: Yup.string().email('Não é um email válido').required('Email é obrigatório!'),
  password: Yup.string().required('Senha é obrigatória!'),
})

export function RegisterLoginData() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const {
    createANewLogin
  } = useStorageData();


  async function handleRegister(formData: FormData) {
    await createANewLogin(formData);

    reset();
    navigation.navigate('Home')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      enabled
      
    >
      <Container>
        <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

        <Form>
          <Input
            title="Título"
            name="title"
            error={errors.title && errors.title.message}
            control={control}
            placeholder="Escreva o título aqui"
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            title="Email"
            name="email"
            error={errors.email && errors.email.message}
            control={control}
            placeholder="Escreva o Email aqui"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            title="Senha"
            name="password"
            error={errors.password && errors.password.message}
            control={control}
            secureTextEntry
            placeholder="Escreva a senha aqui"
          />

          <Button
            style={{
              marginTop: RFValue(26)
            }}
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  )
}