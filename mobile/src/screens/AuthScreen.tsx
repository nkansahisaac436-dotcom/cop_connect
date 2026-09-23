import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield, UserCheck, Mail, Lock, Phone } from 'lucide-react-native';

export const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loginWithEmail, registerAreaHead, registerPastor } = useAuth();
  const { areas } = useData();

  const [mode, setMode] = useState<'login' | 'signup_area' | 'signup_pastor'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [areaName, setAreaName] = useState('');
  const [pastorAreaId, setPastorAreaId] = useState(areas[0]?.id || '');
  const [districtName, setDistrictName] = useState('');

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Please enter your email');
      return;
    }
    const result = loginWithEmail(email.trim(), password || undefined);
    if (result.success) {
      Alert.alert('Signed in successfully!');
      navigation.navigate('Feed');
    } else {
      Alert.alert(result.message || 'Login failed');
    }
  };

  const handleRegisterAreaHead = () => {
    if (!fullName.trim() || !email.trim() || !areaName.trim()) {
      Alert.alert('Please fill in required fields');
      return;
    }
    registerAreaHead({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password || 'password123',
      titlePrefix: 'Apostle',
      areaName: areaName.trim(),
      region: 'Ghana',
      country: 'Ghana',
    });
    Alert.alert('Registration Submitted!', 'Your Area Head account is pending Super Admin verification.');
    navigation.navigate('Feed');
  };

  const handleRegisterPastor = () => {
    if (!fullName.trim() || !email.trim() || !districtName.trim()) {
      Alert.alert('Please fill in required fields');
      return;
    }
    const chosenArea = areas.find((a) => a.id === pastorAreaId);
    registerPastor({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password || 'password123',
      titlePrefix: 'Pastor',
      areaId: pastorAreaId,
      areaName: chosenArea?.name || 'Kaneshie Area',
      districtName: districtName.trim(),
    });
    Alert.alert('Registration Submitted!', 'Your Pastor account has been sent to your Area Head for verification.');
    navigation.navigate('Feed');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {/* Tab switch */}
        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && styles.tabActive]}>
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('signup_area')} style={[styles.tab, mode === 'signup_area' && styles.tabActive]}>
            <Text style={[styles.tabText, mode === 'signup_area' && styles.tabTextActive]}>Area Head</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('signup_pastor')} style={[styles.tab, mode === 'signup_pastor' && styles.tabActive]}>
            <Text style={[styles.tabText, mode === 'signup_pastor' && styles.tabTextActive]}>Pastor</Text>
          </TouchableOpacity>
        </View>

        {mode === 'login' && (
          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="pastor@copconnect.org" style={styles.input} />

            <Text style={styles.label}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry style={styles.input} />

            <TouchableOpacity onPress={handleLogin} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'signup_area' && (
          <View style={styles.form}>
            <Text style={styles.bannerNote}>Apostles create their account and Area. Super Admin verifies you.</Text>
            
            <Text style={styles.label}>Full Name *</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Apostle Isaac Ayani" style={styles.input} />

            <Text style={styles.label}>Email *</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="apostle@thecophq.org" style={styles.input} />

            <Text style={styles.label}>Phone *</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="+233 20 000 0000" style={styles.input} />

            <Text style={styles.label}>Area Name You Are Heading *</Text>
            <TextInput value={areaName} onChangeText={setAreaName} placeholder="e.g. Cape Coast Area" style={styles.input} />

            <TouchableOpacity onPress={handleRegisterAreaHead} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit for Super Admin Verification</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'signup_pastor' && (
          <View style={styles.form}>
            <Text style={styles.bannerNote}>Pastors register and select their Area. The Area Head verifies you.</Text>

            <Text style={styles.label}>Full Name *</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Pastor Gabriel Boasiako" style={styles.input} />

            <Text style={styles.label}>Email *</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="pastor@copconnect.org" style={styles.input} />

            <Text style={styles.label}>Phone *</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="+233 24 000 0000" style={styles.input} />

            <Text style={styles.label}>District Name *</Text>
            <TextInput value={districtName} onChangeText={setDistrictName} placeholder="e.g. Darkuman District" style={styles.input} />

            <TouchableOpacity onPress={handleRegisterPastor} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit to Area Head</Text>
            </TouchableOpacity>
          </View>
        )}
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
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  tabActive: {
    backgroundColor: '#0B2545',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  bannerNote: {
    fontSize: 11,
    color: '#0B2545',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: '600',
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    marginTop: 6,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#0B2545',
    fontWeight: '800',
    fontSize: 13,
  },
});
