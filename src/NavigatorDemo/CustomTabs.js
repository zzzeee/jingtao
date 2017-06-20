/**
 * @flow
 */

import React from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createNavigator,
  createNavigationContainer,
  TabRouter,
  addNavigationHelpers,
} from 'react-navigation';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <View style={{
      height: 800, 
      backgroundColor: 'green',
      justifyContent: 'center',
    }}>
      <Button
        onPress={() => {
          navigation.goBack(null);
        }}
        title="Go back"
      />
    </View>
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Home Screen"
    navigation={navigation}
  />
);

const MyNotificationsScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Notifications Screen"
    navigation={navigation}
  />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Settings Screen"
    navigation={navigation}
  />
);

const CustomTabBar = ({
  navigation,
}) => {
  console.log(navigation);
  const { routes, index } = navigation.state;
  return (
    <View style={styles.tabContainer}>
      {routes.map((route, i) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(route.routeName)}
          style={[styles.tab, {
            backgroundColor: index == i ? 'red' : '#ddd',
          }]}
          key={route.routeName}
        >
          <Text>{route.routeName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const CustomTabView = ({
  router,
  navigation,
}) => {
  const { routes, index } = navigation.state;
  const ActiveScreen = router.getComponentForState(navigation.state);
  return (
    <View style={styles.container}>
      <CustomTabBar navigation={navigation} />
      <ActiveScreen
        navigation={addNavigationHelpers({
          ...navigation,
          state: routes[index],
        })}
      />
    </View>
  );
};

const CustomTabRouter = TabRouter({
  Home: {
    screen: MyHomeScreen,
    path: '',
  },
  Notifications: {
    screen: MyNotificationsScreen,
    path: 'notifications',
  },
  Settings: {
    screen: MySettingsScreen,
    path: 'settings',
  },
}, {
  // Change this to start on a different tab
  initialRouteName: 'Home',
});

const CustomTabs = createNavigationContainer(createNavigator(CustomTabRouter)(CustomTabView));

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    marginBottom: 48,
  },
  tabContainer: {
    position: 'absolute',
    bottom: -48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  }
});

export default CustomTabs;
