import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';
import { LoginDataProps } from '../../hooks/storageData';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import { useStorageData } from '../../hooks/storageData';



type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([] as LoginListDataProps);
  const {
    getAllLogins,
    loginDataList,
  } = useStorageData();
  
  async function loadData(){
    await getAllLogins();
    setSearchListData(loginDataList);
  }
  
  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    const startsWithABlank: boolean = search.indexOf(' ') === 0;

    const filterLoginData = () => {
      const filteredData = loginDataList.filter(item => {
        const upperCaseItem = item.title.toUpperCase();
        
        if(upperCaseItem.includes(search.trim().toUpperCase())){
          return item.title
        }
      });
      setSearchListData(filteredData);
    }
    

    if(!startsWithABlank || search.trim() !== ''){
      filterLoginData();
    }else{
      setSearchListData(loginDataList);
    }
  }


  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  useFocusEffect(useCallback(() => {
    if(searchListData.length === 0 && loginDataList.length > 0){
      loadData();
    }
  }, [searchListData]));


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