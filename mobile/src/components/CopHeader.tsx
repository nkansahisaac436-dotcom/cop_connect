import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, UserCheck, Users } from 'lucide-react-native';

export const CopHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.logoRow}>
          <View style={styles.emblemWrapper}>
            <Image
              source={require('../../assets/cop_emblem_circle.png')}
              style={styles.emblemImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>COP CONNECT</Text>
            <Text style={styles.headerSubtitle}>The Church of Pentecost</Text>
          </View>
        </View>

        {currentUser && (
          <TouchableOpacity onPress={logout} style={styles.userBadge}>
            <View style={styles.roleIcon}>
              {currentUser.role === 'super_admin' ? (
                <Shield size={12} color="#F1B51C" />
              ) : currentUser.role === 'area_head' ? (
                <UserCheck size={12} color="#F1B51C" />
              ) : (
                <Users size={12} color="#F1B51C" />
              )}
            </View>
            <Text style={styles.userRoleText}>
              {currentUser.role === 'super_admin'
                ? 'HQ Admin'
                : currentUser.role === 'area_head'
                ? 'Area Head'
                : 'Pastor'}
            </Text>
            <LogOut size={13} color="#F1B51C" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#091B33',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(241, 181, 28, 0.4)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emblemWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1B51C',
  },
  emblemImage: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    color: '#F1B51C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(241, 181, 28, 0.4)',
  },
  roleIcon: {
    marginRight: -2,
  },
  userRoleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
