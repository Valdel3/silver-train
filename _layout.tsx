import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expiring"
        options={{
          title: 'Expiring Soon',
          tabBarIcon: ({ color }) => <TabBarIcon name="hourglass-end" color={color} />,
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: 'Grocery List',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ripeness"
        options={{
          title: 'Ripeness Check',
          tabBarIcon: ({ color }) => <TabBarIcon name="check-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="low"
        options={{
          title: 'Low Quantity',
          tabBarIcon: ({ color }) => <TabBarIcon name="sort-amount-desc" color={color} />,
        }}
      />
    </Tabs>
  );
}
