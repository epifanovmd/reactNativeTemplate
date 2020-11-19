import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { createSimpleStore } from "./store/store";
import { AppRoutes } from "./routes";
import { initLocalization } from "./localization/localization";
import styled from "styled-components/native";

initLocalization({ initLang: "ru" }).finally();
export const store = createSimpleStore();

const App = () => (
  <Provider store={store}>
    <Suspense fallback={<Text>Loading...</Text>}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"light-content"}
      />
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </Suspense>
  </Provider>
);

export default App;

const Text = styled.Text``;
