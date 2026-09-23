import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCheck, Users, LogOut } from 'lucide-react-native';

interface CopHeaderProps {
  onOpenAuth?: () => void;
}

export const CopHeader: React.FC<CopHeaderProps> = ({ onOpenAuth }) => {
  const { currentUser, loginAs, logout } = useAuth();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>COP</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>COP CONNECT</Text>
            <Text style={styles.headerSubtitle}>The Church of Pentecost</Text>
          </View>
        </View>

        {currentUser ? (
          <TouchableOpacity onPress={logout} style={styles.userBadge}>
            <Text style={styles.userRoleText}>
              {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'area_head' ? 'Area Head' : 'Pastor'}
            </Text>
            <LogOut size={14} color="#F59E0B" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onOpenAuth} style={styles.signInBtn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Role Tester Pills */}
      <View style={styles.roleSwitcherRow}>
        <TouchableOpacity 
          onPress={() => loginAs('usr_super_admin')} 
          style={[styles.rolePill, currentUser?.role === 'super_admin' && styles.rolePillActive]}
        >
          <Text style={[styles.rolePillText, currentUser?.role === 'super_admin' && styles.rolePillTextActive]}>Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => loginAs('usr_area_kaneshie')} 
          style={[styles.rolePill, currentUser?.role === 'area_head' && styles.rolePillActive]}
        >
          <Text style={[styles.rolePillText, currentUser?.role === 'area_head' && styles.rolePillTextActive]}>Area Head</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => loginAs('usr_pastor_kaneshie_central')} 
          style={[styles.rolePill, currentUser?.role === 'pastor' && styles.rolePillActive]}
        >
          <Text style={[styles.rolePillText, currentUser?.role === 'pastor' && styles.rolePillTextActive]}>Pastor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0B2545',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
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
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#133E87',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#133E87',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  userRoleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  signInBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  signInText: {
    color: '#0B2545',
    fontWeight: '800',
    fontSize: 12,
  },
  roleSwitcherRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#133E87',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  rolePillActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  rolePillText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  rolePillTextActive: {
    color: '#0B2545',
  },
});
