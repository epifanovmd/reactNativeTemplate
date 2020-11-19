import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "../app.json";

export function registerApp(): void {
  AppRegistry.registerComponent(appName, () => App);
}
