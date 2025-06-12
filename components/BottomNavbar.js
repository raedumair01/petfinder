import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

export default function BottomNavbar({ setUser }) {
  const navigation = useNavigation();
  const [pressedItem, setPressedItem] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentRoute = navigation.getState()?.routes[navigation.getState().index]?.name;
      setActiveScreen(currentRoute);
    });

    return unsubscribe;
  }, [navigation]);

  const navigateTo = (screen) => {
    if (screen === 'Login' && setUser) {
      setUser(null);
    }
    navigation.navigate(screen);
  };

  const navItems = [
    { 
      name: 'Home', 
      svg: 'M19.5065 3.70481C19.8958 3.56325 20.0966 3.13293 19.955 2.74365C19.8135 2.35438 19.3832 2.15356 18.9939 2.29511L6.50037 6.83822V2.99996C6.50037 2.58575 6.16458 2.24996 5.75037 2.24996H4.25037C3.83615 2.24996 3.50037 2.58575 3.50037 2.99996V7.92913L2.4939 8.29511C2.10462 8.43667 1.9038 8.86699 2.04536 9.25627C2.18691 9.64554 2.61724 9.84636 3.00651 9.7048L19.5065 3.70481Z M3.51932 11.1145L18.5004 5.66684V9.08833L22.5065 10.5451C22.8958 10.6867 23.0966 11.117 22.955 11.5063C22.8135 11.8955 22.3832 12.0964 21.9939 11.9548L21.5002 11.7753V20.25H22.2504C22.6646 20.25 23.0004 20.5857 23.0004 21C23.0004 21.4142 22.6646 21.75 22.2504 21.75H2.75037C2.33615 21.75 2.00037 21.4142 2.00037 21C2.00037 20.5857 2.33615 20.25 2.75037 20.25H3.50037V11.1213L3.51932 11.1145ZM18.5004 20.25V10.6844L20.0002 11.2298V20.25H18.5004ZM9.50037 14.25C9.08615 14.25 8.75037 14.5857 8.75037 15V19.5C8.75037 19.9142 9.08615 20.25 9.50037 20.25H12.5004C12.9146 20.25 13.2504 19.9142 13.2504 19.5V15C13.2504 14.5857 12.9146 14.25 12.5004 14.25H9.50037Z',
      screen: 'Home' 
    },
    { 
      name: 'Lost & Found', 
      svg: 'M8.33301 1.75C4.60509 1.75 1.58301 4.77208 1.58301 8.5C1.58301 12.2279 4.60509 15.25 8.33301 15.25C10.1972 15.25 11.8836 14.4953 13.106 13.273C14.3283 12.0506 15.083 10.3642 15.083 8.5C15.083 4.77208 12.0609 1.75 8.33301 1.75ZM0.0830078 8.5C0.0830078 3.94365 3.77666 0.25 8.33301 0.25C12.8894 0.25 16.583 3.94365 16.583 8.5C16.583 10.5078 15.865 12.3491 14.6729 13.7793L19.3633 18.4697C19.6562 18.7626 19.6562 19.2374 19.3633 19.5303C19.0704 19.8232 18.5956 19.8232 18.3027 19.5303L13.6123 14.8399C12.1821 16.032 10.3408 16.75 8.33301 16.75C3.77666 16.75 0.0830078 13.0563 0.0830078 8.5Z',
      screen: 'LostFound' 
    },
    { 
      name: 'Found Pet', 
      svg: 'M14.417 5.5C13.0411 5.5 11.6784 5.55702 10.331 5.66884C8.79175 5.7966 7.66699 7.10282 7.66699 8.60821V12.8937C7.66699 14.4014 8.79496 15.7083 10.3362 15.8341C11.5801 15.9357 12.837 15.9912 14.1054 15.999L16.8867 18.7803C17.1012 18.9948 17.4237 19.059 17.704 18.9429C17.9843 18.8268 18.167 18.5533 18.167 18.25V15.8601C18.2773 15.8518 18.3876 15.8432 18.4977 15.8342C20.039 15.7085 21.167 14.4015 21.167 12.8938V8.60822C21.167 7.10283 20.0422 5.79661 18.5029 5.66885C17.1556 5.55702 15.7929 5.5 14.417 5.5Z M3.58006 0.658231C5.65469 0.38888 7.76995 0.25 9.91728 0.25C12.0644 0.25 14.1794 0.388852 16.2539 0.65815C18.1761 0.907693 19.5453 2.51937 19.6593 4.38495C19.3335 4.27614 18.9882 4.20396 18.627 4.17399C17.2385 4.05874 15.8343 4 14.417 4C12.9996 4 11.5955 4.05874 10.207 4.17398C7.84869 4.36971 6.16699 6.36467 6.16699 8.60821V12.8937C6.16699 14.5844 7.12167 16.1326 8.59979 16.8779L5.94732 19.5303C5.73282 19.7448 5.41024 19.809 5.12998 19.6929C4.84972 19.5768 4.66699 19.3033 4.66699 19V14.9705C4.30348 14.9316 3.94116 14.8887 3.58008 14.8418C1.57165 14.581 0.166992 12.8333 0.166992 10.8626V4.63738C0.166992 2.66672 1.57165 0.918985 3.58006 0.658231Z',
      screen: 'Found Pet' 
    },
    { 
      name: 'Education', 
      svg: 'M5 3H19C20.1 3 21 3.9 21 5V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V5C3 3.9 3.9 3 5 3ZM5 5V17H19V5H5ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z',
      viewBox: '0 0 24 24',
      screen: 'education' 
    },
    { 
      name: 'Profile', 
      svg: 'M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.34 14 5 15.34 5 17V19H19V17C19 15.34 15.66 14 12 14Z',
      screen: 'Profile' ,
    },
 
    
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = activeScreen === item.screen;
        const isPressed = pressedItem === item.name;

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigateTo(item.screen)}
            onPressIn={() => setPressedItem(item.name)}
            onPressOut={() => setPressedItem(null)}
          >
            <Svg width="24" height="24" viewBox={item.viewBox} fill="none">
              <Path
                d={item.svg}
                fill={isActive || isPressed ? '#B85B2F' : '#394345'}
              />
            </Svg>
            <Text
              style={[
                styles.navLabel,
                { color: isActive || isPressed ? '#B85B2F' : '#485456' },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    borderTopWidth: 2,
    borderTopColor: 'lightgray',
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