import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/ProjectCard';
import { PlusCircle, Building2, Flame, CheckCircle2, TrendingUp, Users } from 'lucide-react-native';

interface PastorDashboardScreenProps {
  navigation: any;
}

export const PastorDashboardScreen: React.FC<PastorDashboardScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { projects } = useData();

  if (!currentUser) return null;

  const myProjects = projects.filter(
    (p) =>
      p.postedByUserId === currentUser.id ||
      (currentUser.districtId && p.districtId === currentUser.districtId) ||
      (currentUser.districtName && p.districtName === currentUser.districtName)
  );

  const ongoingCount = myProjects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = myProjects.filter((p) => p.status === 'Completed').length;

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerHeader}>
          <Text style={styles.districtName}>{currentUser.districtName || 'My District'}</Text>
          <Text style={styles.areaName}>{currentUser.areaName}</Text>
        </View>

        <Text style={styles.pastorName}>
          Minister: {currentUser.titlePrefix || 'Pastor'} {currentUser.fullName}
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Projects</Text>
            <Text style={styles.statValue}>{myProjects.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ongoing</Text>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>{ongoingCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>{completedCount}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Upload')}
          style={styles.uploadBtn}
        >
          <PlusCircle size={16} color="#0B2545" />
          <Text style={styles.uploadBtnText}>Upload District Project</Text>
        </TouchableOpacity>
      </View>

      {/* Projects Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>District Projects ({myProjects.length})</Text>
      </View>

      <FlatList
        data={myProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Building2 size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Projects Uploaded Yet</Text>
            <Text style={styles.emptySubtitle}>Tap the button above to upload your first project</Text>
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
    borderColor: '#F59E0B',
  },
  bannerHeader: {
    marginBottom: 4,
  },
  districtName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  areaName: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  pastorName: {
    color: '#E2E8F0',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#133E87',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  uploadBtnText: {
    color: '#0B2545',
    fontWeight: '800',
    fontSize: 12,
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
