import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MapPin, Heart, MessageSquare, TrendingUp, Building2, Compass, Sparkles } from 'lucide-react-native';

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const { currentUser } = useAuth();
  const { toggleLike, addComment } = useData();

  const isLiked = currentUser ? project.likes.includes(currentUser.id) : false;

  return (
    <View style={styles.card}>
      {/* Project Image */}
      {project.photos && project.photos.length > 0 && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: project.photos[0] }} style={styles.image} resizeMode="cover" />
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{project.category}</Text>
          </View>

          <View style={[
            styles.statusBadge, 
            project.status === 'Completed' ? styles.statusCompleted : project.status === 'Ongoing' ? styles.statusOngoing : styles.statusPlanned
          ]}>
            <Text style={styles.statusBadgeText}>{project.status}</Text>
          </View>
        </View>
      )}

      {/* Card Content */}
      <View style={styles.content}>
        {/* Area / District Tag */}
        <View style={styles.locationRow}>
          <MapPin size={13} color="#F59E0B" />
          <Text style={styles.locationText}>
            {project.areaName} {project.districtName ? `• ${project.districtName}` : ''}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{project.title}</Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {project.description}
        </Text>

        {/* Funding Progress */}
        {project.fundingProgress !== undefined && (
          <View style={styles.fundingBox}>
            <View style={styles.fundingHeader}>
              <Text style={styles.fundingLabel}>Project Progress</Text>
              <Text style={styles.fundingPercent}>{project.fundingProgress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${project.fundingProgress}%` }]} />
            </View>
          </View>
        )}

        {/* Author Details */}
        <View style={styles.authorRow}>
          <Text style={styles.authorName}>By {project.postedByName}</Text>
          <Text style={styles.postedRole}>({project.postedByRole.replace('_', ' ').toUpperCase()})</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            onPress={() => currentUser && toggleLike(project.id, currentUser.id)} 
            style={[styles.actionBtn, isLiked && styles.actionBtnActive]}
          >
            <Heart size={16} color={isLiked ? '#DC2626' : '#64748B'} fill={isLiked ? '#DC2626' : 'none'} />
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {project.likes.length} Praise
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              if (currentUser) {
                addComment(project.id, 'Glory to God for this great step forward!', 'encouragement', currentUser);
              }
            }} 
            style={styles.actionBtn}
          >
            <MessageSquare size={16} color="#64748B" />
            <Text style={styles.actionText}>Send Praise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(11, 37, 69, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOngoing: {
    backgroundColor: '#DC2626',
  },
  statusCompleted: {
    backgroundColor: '#059669',
  },
  statusPlanned: {
    backgroundColor: '#D97706',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    color: '#0B2545',
    fontWeight: '700',
    fontSize: 11,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  fundingBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fundingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fundingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B2545',
  },
  fundingPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  authorName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  postedRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  actionBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  actionTextActive: {
    color: '#DC2626',
  },
});
