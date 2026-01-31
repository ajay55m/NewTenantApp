import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Detect small devices
const isSmallDevice = screenWidth < 375 || screenHeight < 667;

const TabItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    {typeof icon === 'number' ? (
      <Image
        source={icon}
        style={[
          styles.tabIconImage,
          isSmallDevice && styles.tabIconImageSmall,
          active && { tintColor: '#000000' }
        ]}
      />
    ) : (
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    )}
    <Text style={[styles.tabLabel, isSmallDevice && styles.tabLabelSmall, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function Footer({ onPress, selectedPage }) {
  const extraBottom = Platform.OS === 'android' ? (isSmallDevice ? 16 : 20) : (isSmallDevice ? 20 : 24);

  return (
    <View style={[styles.bottomBar, isSmallDevice && styles.bottomBarSmall, { paddingBottom: extraBottom }]}>
      <TabItem
        label="Home"
        icon={require('../../assets/images/home.png')}
        active={selectedPage === 'dashboard'}
        onPress={() => onPress && onPress('dashboard')}
      />

      <TabItem
        label="Billing"
        icon={require('../../assets/images/invoice.png')}
        active={selectedPage === 'bill-history'}
        onPress={() => onPress && onPress('bill-history')}
      />

      {/* Center FAB */}
      <View style={styles.fabWrapper} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.fab, isSmallDevice && styles.fabSmall]}
          onPress={() => onPress && onPress('profile')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/user (1).png')}
            style={[styles.fabIconImage, isSmallDevice && styles.fabIconImageSmall]}
          />
        </TouchableOpacity>
      </View>

      <TabItem
        label="Payment"
        icon={require('../../assets/images/credit-card.png')}
        active={selectedPage === 'payment-history'}
        onPress={() => onPress && onPress('payment-history')}
      />

      <TabItem
        label="Ticket"
        icon={require('../../assets/images/tickets.png')}
        active={selectedPage === 'raise-ticket'}
        onPress={() => onPress && onPress('raise-ticket')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 12,
    height: 70,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarSmall: {
    height: 64,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  tabItem: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 6,
  },
  tabIcon: { 
    fontSize: 24, 
    marginBottom: 4, 
    color: '#9CA3AF' 
  },
  tabLabel: { 
    fontSize: 12, 
    color: '#9CA3AF',
    marginTop: 2,
  },
  tabLabelSmall: {
    fontSize: 10,
    marginTop: 1,
  },
  tabIconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
  },
  tabIconImageSmall: {
    width: 20,
    height: 20,
    marginBottom: 2,
  },
  tabIconActive: { 
    color: '#000000' 
  },
  tabLabelActive: { 
    color: '#000000', 
    fontWeight: '700' 
  },
  fabIconImage: { 
    width: 26, 
    height: 26, 
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  fabIconImageSmall: {
    width: 22,
    height: 22,
  },
  fabWrapper: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 0,
  },
  fabSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});