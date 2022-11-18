import React from "react";
import { Button, SafeAreaView, View } from "react-native";

import { trpc } from "../utils/trpc";
import useAuthentication from "../hooks/useAuthentication";

export const HomeScreen = () => {
  const postQuery = trpc.workout.all.useQuery();
  const { signout } = useAuthentication();

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Button title="Logout" onPress={signout} />
        <Button title="Refetch" onPress={() => postQuery.refetch()} />
      </View>
    </SafeAreaView>
  );
};
