import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCategory, ProjectStatus } from '../types';
import { Image as ImageIcon, Camera, Send, X } from 'lucide-react-native';

interface UploadProjectScreenProps {
  navigation: any;
}

export const UploadProjectScreen: React.FC<UploadProjectScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { addProject } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Church Building');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  const [photos, setPhotos] = useState<string[]>([]);

  const categories: ProjectCategory[] = [
    'Church Building',
    'Outreach/Evangelism',
    'Community Project',
    'Mission House',
    'Conference/Event',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !currentUser) {
      Alert.alert('Please enter a project title');
      return;
    }

    addProject(
      {
        title: title.trim(),
        category,
        status,
        description: description.trim() || `Update from ${currentUser.districtName || currentUser.areaName}.`,
        photos,
      },
      currentUser
    );

    Alert.alert('Success!', 'Your project has been published to the National Feed!');
    navigation.navigate('Feed');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Upload New Project Update</Text>
        <Text style={styles.headerSubtitle}>
          Posting for: {currentUser?.districtName || currentUser?.areaName}
        </Text>

        {/* Title */}
        <Text style={styles.label}>Project Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. New 2,000-Seater Central Auditorium"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.chipRow}>
          {(['Planned', 'Ongoing', 'Completed'] as ProjectStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              style={[styles.chip, status === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description & Scope</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add details on current stage, seating capacity, or soul count..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        />

        {/* Photo Buttons */}
        <Text style={styles.label}>Photos</Text>
        <View style={styles.photoActions}>
          <TouchableOpacity onPress={takePhoto} style={styles.photoBtn}>
            <Camera size={18} color="#0B2545" />
            <Text style={styles.photoBtnText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage} style={styles.photoBtn}>
            <ImageIcon size={18} color="#0B2545" />
            <Text style={styles.photoBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Photos Preview */}
        {photos.length > 0 && (
          <ScrollView horizontal style={styles.photoPreviewRow}>
            {photos.map((uri, idx) => (
              <View key={idx} style={styles.previewBox}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  onPress={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                  style={styles.deletePhotoBtn}
                >
                  <X size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
          <Send size={18} color="#0B2545" />
          <Text style={styles.submitBtnText}>Publish to National Feed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2545',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  chipActive: {
    backgroundColor: '#0B2545',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2545',
  },
  photoPreviewRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  previewBox: {
    width: 80,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    gap: 8,
  },
  submitBtnText: {
    color: '#0B2545',
    fontWeight: '900',
    fontSize: 14,
  },
});
