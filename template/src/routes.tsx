import React, { FC, memo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Header } from "./components/layouts/header/header";
import Users from "./modules/users/Users";
import { useTranslation } from "./common/hooks/useTranslation";

const Tab = createBottomTabNavigator();

export const routeNames = {
  HOME: "home",
  USERS: "users",
};

export const routes = [
  {
    title: "home",
    name: routeNames.HOME,
    component: Header,
  },
  {
    title: "users",
    name: routeNames.USERS,
    component: Users,
  },
];

export const AppRoutes: FC = memo(() => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      {routes.map(({ name, component, title }, index) => (
        <Tab.Screen
          key={index}
          options={{ title: t(title as any) }}
          name={name}
          component={component}
        />
      ))}
    </Tab.Navigator>
  );
});
