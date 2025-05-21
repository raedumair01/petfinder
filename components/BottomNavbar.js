import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BottomNavbar({ setUser }) {
  const navigation = useNavigation();
  const [pressedItem, setPressedItem] = useState(null);

  const navigateTo = (screen) => {
    if (screen === 'Login' && setUser) {
      setUser(null);
    }
    navigation.navigate(screen);
  };

  const navItems = [
    { name: 'Home', icon: 'home', screen: 'Home' },
    { name: 'Search', icon: 'magnify', screen: 'Search' },
    { name: 'Messages', icon: 'message', screen: 'Messages' },
    { name: 'Setting', icon: 'cog', screen: 'Setting' },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navItem}
          onPress={() => navigateTo(item.screen)}
          onPressIn={() => setPressedItem(item.name)}
          onPressOut={() => setPressedItem(null)}
        >
          <Icon
            name={item.icon}
            size={24}
            color={pressedItem === item.name ? '#B85B2F' : '#2B3334'}
            style={styles.navIcon}
          />
          <Text
            style={[
              styles.navLabel,
              { color: pressedItem === item.name ? '#B85B2F' : '#485456' },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFBFA',
    paddingVertical: 10,
    borderTopWidth: 5,
    borderTopColor: '#B85B2F',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});