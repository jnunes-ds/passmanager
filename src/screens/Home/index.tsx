import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([] as LoginListDataProps);
  const [data, setData] = useState<LoginListDataProps>([] as LoginListDataProps);
  const loginsKey = '@passmanager:logins';

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    const logins = await AsyncStorage.getItem(loginsKey);
    const loginsFormatted = logins ? JSON.parse(logins) : [];

    setData(loginsFormatted);
    setSearchListData(loginsFormatted);
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    const startsWithABlank: boolean = search.indexOf(' ') === 0;

    const filterLoginData = () => {
      const filteredData = data.filter(item => {
        const upperCaseItem = item.title.toUpperCase();
        
        if(upperCaseItem.includes(search.trim().toUpperCase())){
          return item.title
        }
      });
  
      setSearchListData(filteredData);
    }
    

    if(!startsWithABlank){
      filterLoginData();
    }else if(search.trim() !== ''){
      filterLoginData();
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}