import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarMenu from './SidebarMenu';

export default function Header({
  onPress,
  onNavigate,
  showMenu = true,
  unreadCount = 0,
  onLogout,
  tenantName = 'Tenant',
  tenantAvatar,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    onLogout?.();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerWrapper}>

        {/* ───────── TOP BAR ───────── */}
        <View style={styles.topBar}>
          {showMenu ? (
            <SidebarMenu onSelect={onPress} onNavigate={onNavigate} />
          ) : (
            <View style={styles.menuSpacer} />
          )}

          {/* LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/sglobal-icon.jpg')}
              style={styles.logoImage}
            />
          </View>

          {/* RIGHT ACTIONS */}
          <View style={styles.rightActions}>
            {/* 🔔 NOTIFICATIONS → NAVIGATE */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onNavigate?.('Notifications')}
            >
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
              <Image
                source={require('../../assets/images/notification.png')}
                style={styles.topIconImage}
              />
            </TouchableOpacity>

            {/* AVATAR */}
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowProfileMenu(true)}
            >
              <Image
                source={
                  tenantAvatar
                    ? { uri: tenantAvatar }
                    : require('../../assets/images/serprofile.png')
                }
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ───────── PROFILE DROPDOWN ───────── */}
        {showProfileMenu && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowProfileMenu(false)}
            />

            <View style={styles.profileMenu}>
              <Image
                source={
                  tenantAvatar
                    ? { uri: tenantAvatar }
                    : require('../../assets/images/serprofile.png')
                }
                style={styles.profileAvatar}
              />

              <Text style={styles.profileName}>{tenantName}</Text>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Image
                  source={require('../../assets/images/logout.png')}
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 60,
  },
  menuSpacer: { width: 40 },
  logoContainer: { flex: 1, alignItems: 'center' },
  logoImage: { width: 48, height: 48, resizeMode: 'contain' },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIconImage: { width: 26, height: 26, tintColor: '#1F2937' },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 1,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  avatarImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 99 },
  profileMenu: {
    position: 'absolute',
    top: 64,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 8,
    zIndex: 100,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 10,
  },
  logoutButton: { flexDirection: 'row', alignItems: 'center' },
  logoutIcon: { width: 16, height: 16, marginRight: 6 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
});
