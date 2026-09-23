import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';
import { UserCheck, CheckCircle2, XCircle, Building2, MapPin, Layers } from 'lucide-react-native';

export const AreaHeadDashboardScreen: React.FC = () => {
  const { currentUser, users, approveUser } = useAuth();
  const { projects, districts } = useData();
  const [tab, setTab] = useState<'approvals' | 'projects'>('approvals');

  if (!currentUser) return null;

  const pendingPastors = users.filter(
    (u) =>
      u.role === 'pastor' &&
      u.status === 'pending' &&
      (u.areaId === currentUser.areaId || u.areaName === currentUser.areaName)
  );

  const areaProjects = projects.filter(
    (p) => p.areaId === currentUser.areaId || p.areaName === currentUser.areaName
  );

  const handleApprove = (pastor: any) => {
    approveUser(pastor.id, currentUser);
    Alert.alert('Pastor Approved!', `${pastor.fullName} is now confirmed for ${pastor.districtName}.`);
  };

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.areaTitle}>{currentUser.areaName || 'Kaneshie Area'}</Text>
        <Text style={styles.areaSubtitle}>
          Area Head: {currentUser.titlePrefix || 'Apostle'} {currentUser.fullName}
        </Text>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setTab('approvals')}
            style={[styles.tabBtn, tab === 'approvals' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, tab === 'approvals' && styles.tabTextActive]}>
              Pastor Approvals ({pendingPastors.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('projects')}
            style={[styles.tabBtn, tab === 'projects' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, tab === 'projects' && styles.tabTextActive]}>
              Area Projects ({areaProjects.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab 1: Pastor Approvals */}
      {tab === 'approvals' && (
        <FlatList
          data={pendingPastors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.approvalCard}>
              <View style={styles.approvalHeader}>
                <View>
                  <Text style={styles.pastorName}>{item.titlePrefix || 'Pastor'} {item.fullName}</Text>
                  <View style={styles.districtRow}>
                    <MapPin size={12} color="#F59E0B" />
                    <Text style={styles.districtText}>Requested: {item.districtName}</Text>
                  </View>
                </View>
                <Text style={styles.pendingBadge}>Pending</Text>
              </View>

              <Text style={styles.contactInfo}>{item.email} • {item.phone}</Text>

              <TouchableOpacity
                onPress={() => handleApprove(item)}
                style={styles.approveBtn}
              >
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.approveBtnText}>Confirm & Approve Pastor</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <CheckCircle2 size={40} color="#059669" />
              <Text style={styles.emptyTitle}>All Pastors in Your Area Verified</Text>
              <Text style={styles.emptySubtitle}>New registrations will appear here for your confirmation</Text>
            </View>
          }
        />
      )}

      {/* Tab 2: Area Projects */}
      {tab === 'projects' && (
        <FlatList
          data={areaProjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProjectCard project={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Building2 size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Projects in this Area yet</Text>
            </View>
          }
        />
      )}
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
    borderColor: '#F59E0B',
  },
  areaTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  areaSubtitle: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#133E87',
  },
  tabBtnActive: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0B2545',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  approvalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pastorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  districtText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B2545',
  },
  pendingBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  contactInfo: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  approveBtnText: {
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
  emptySubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
