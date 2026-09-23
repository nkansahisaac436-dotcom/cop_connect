import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield, CheckCircle2, Globe2 } from 'lucide-react-native';

export const SuperAdminScreen: React.FC = () => {
  const { currentUser, users, approveUser } = useAuth();
  const { areas } = useData();

  const pendingAreaHeads = users.filter(
    (u) => u.role === 'area_head' && u.status === 'pending'
  );

  const handleVerify = (applicant: any) => {
    if (!currentUser) return;
    approveUser(applicant.id, currentUser);
    Alert.alert('Area Head Verified!', `${applicant.fullName} is verified over ${applicant.areaName}.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Head Office Super Admin</Text>
        <Text style={styles.bannerSubtitle}>Area Head Verification Command</Text>
        <Text style={styles.bannerDesc}>
          Area Heads self-register their Area. Simply verify their appointment to activate their Area.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pending Area Heads ({pendingAreaHeads.length})</Text>
      </View>

      <FlatList
        data={pendingAreaHeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.apostleName}>{item.titlePrefix || 'Apostle'} {item.fullName}</Text>
            <View style={styles.areaRow}>
              <Globe2 size={13} color="#F59E0B" />
              <Text style={styles.areaText}>Area: {item.areaName}</Text>
            </View>
            <Text style={styles.contactText}>{item.email} • {item.phone}</Text>

            <TouchableOpacity
              onPress={() => handleVerify(item)}
              style={styles.verifyBtn}
            >
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text style={styles.verifyBtnText}>Verify Apostle & Activate {item.areaName}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <CheckCircle2 size={40} color="#059669" />
            <Text style={styles.emptyTitle}>All Registered Area Heads Are Verified</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  banner: {
    backgroundColor: '#0B2545',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 6,
  },
  bannerDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  apostleName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  areaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B2545',
  },
  contactText: {
    fontSize: 11,
    color: '#64748B',
    marginVertical: 8,
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
});
