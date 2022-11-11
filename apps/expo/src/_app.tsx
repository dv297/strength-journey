import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TRPCProvider } from "./utils/trpc";
import Login from "./screens/Login";
import useAuthentication, {
  AuthenticationProvider,
} from "./hooks/useAuthentication";
import { HomeScreen } from "./screens/home";

const Stack = createNativeStackNavigator();

const Stacks = () => {
  const { user } = useAuthentication();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
        </>
      )}
    </Stack.Navigator>
  );
};

export const App = () => {
  return (
    <AuthenticationProvider>
      <TRPCProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stacks />
          </NavigationContainer>
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </AuthenticationProvider>
  );
};
