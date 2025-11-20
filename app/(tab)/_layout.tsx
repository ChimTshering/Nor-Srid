import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        options={{
          headerShown: false,
          // tabBarButton: TabIcon,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="auto-graph"
              size={focused ? 30 : 28}
              color={color}
            />
          ),
          title: "Analytics",
        }}
        name="index"
      />
      {/* <Tabs.Screen
        options={{
          headerShown: false,
          title: "Expenses",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="shopping-outline"
              size={focused ? 30 : 28}
              color={color}
            />
          ),
        }}
        name="expense"
      /> */}
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "Credits",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="sack-dollar"
              size={focused ? 30 : 28}
              color={color}
            />
          ),
        }}
        name="credit"
      />
    </Tabs>
  );
}

const TabIcon = (prop: BottomTabBarButtonProps) => {
  return (
    <Pressable
      onPress={prop?.onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons name="auto-graph" size={24} color="black" />
      <Text>Analytics</Text>
    </Pressable>
  );
};

const ExpenseTab = (prop: BottomTabBarButtonProps) => {
  return (
    <Pressable
      onPress={prop.onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name="shopping-outline" size={24} color="black" />
      <Text>Expenses</Text>
    </Pressable>
  );
};

const CreditTab = (prop: BottomTabBarButtonProps) => {
  return (
    <Pressable
      onPress={prop.onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesome6 name="sack-dollar" size={24} color="black" />
      <Text>Credit</Text>
    </Pressable>
  );
};
