import React, { createContext, ReactNode, useState, useContext } from 'react';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface FormData{
    title: string;
    email: string;
    password: string;
}

interface LoginDataProps extends FormData{
  id: string;
};

interface StorageDataProviderProps{
    children: ReactNode;
}

interface StorageDataContextProps{
    loginDataList: LoginDataProps[];
    createANewLogin(formData : FormData): Promise<void>;
    getAllLogins(): Promise<void>;
}



const StorageDataContext = createContext({} as StorageDataContextProps);

function StorageDataProvider({ children }: StorageDataProviderProps){
    const [loginDataList, setLoginDataList] = useState<LoginDataProps[]>([] as LoginDataProps[]);

    const loginsStorageKey = '@passmanager:logins';

    async function getAllLogins() {
        // Get asyncStorage data, use setSearchListData and setData
        const logins = await AsyncStorage.getItem(loginsStorageKey);
        const loginsFormatted = logins ? JSON.parse(logins) : [];

        setLoginDataList(loginsFormatted);
    }

    async function createANewLogin(formData : FormData){
        const newLoginData = {
            id: String(uuid.v4()),
            ...formData
        }
        // Save data on AsyncStorage
        try {
            const logins = await AsyncStorage.getItem(loginsStorageKey);
            const currentLogins = logins ? JSON.parse(logins) : [];
        
            const loginsFormatted = [
                ...currentLogins,
                newLoginData
            ];

            await AsyncStorage.setItem(loginsStorageKey, JSON.stringify(loginsFormatted));
            console.log(logins);

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível cadastrar o login.');
        }
    }

  return (
      <StorageDataContext.Provider
        value={{
            loginDataList,
            createANewLogin,
            getAllLogins

        }}
      >
          { children }
      </StorageDataContext.Provider>
  );
}

function useStorageData(){
    const context = useContext(StorageDataContext);

    return context;
}

export {
    StorageDataProvider,
    useStorageData
};