import { KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { Button } from "react-native-ui-lib";
import useAuthentication from "../hooks/useAuthentication";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin } = useAuthentication();

  return (
    <KeyboardAvoidingView>
      <View className="w-full min-h-screen flex items-center">
        <View className="my-16">
          <Text className="text-2xl font-extrabold text-sky-500">
            Strength Journeys
          </Text>
        </View>
        <View className="w-3/4 bg-white py-8 px-4 rounded-lg">
          <View>
            <TextInput
              textContentType="emailAddress"
              placeholder="Email"
              className="border-b-2 border-solid border-gray-100"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="mt-8">
            <TextInput
              placeholder="Password"
              secureTextEntry
              className="border-b-2 border-solid border-gray-100"
              onChangeText={setPassword}
            />
          </View>
          <View className="mt-4 flex items-start w-full">
            <Button
              label="Login"
              onPress={() => {
                signin(email, password);
              }}
              size={Button.sizes.large}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
