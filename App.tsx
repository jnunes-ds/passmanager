import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './src/routes/app.routes';
import { StorageDataProvider } from './src/hooks/storageData';

import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import theme from './src/global/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
      <NavigationContainer>
        <ThemeProvider theme={theme}>
        <StatusBar
            animated={true}
            showHideTransition="fade"  
            translucent={true}
            backgroundColor="transparent"
            barStyle="light-content"
          />
        <StorageDataProvider>
          <AppRoutes />
        </StorageDataProvider>
        </ThemeProvider>
      </NavigationContainer>
  );
}