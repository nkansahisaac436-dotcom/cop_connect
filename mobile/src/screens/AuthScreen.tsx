import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield, UserCheck, Users, Camera, Lock, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react-native';

export const AuthScreen: React.FC<{ navigation?: any; onLoginSuccess?: () => void }> = ({
  navigation,
  onLoginSuccess,
}) => {
  const { loginWithEmail, registerSuperAdmin, registerAreaHead, registerPastor, users } = useAuth();
  const { areas } = useData();

  const [authView, setAuthView] = useState<'login' | 'request_access'>('login');
  const [role, setRole] = useState<'super_admin' | 'area_head' | 'pastor'>('pastor');

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration inputs
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [areaName, setAreaName] = useState('');
  const [pastorAreaId, setPastorAreaId] = useState(areas[0]?.id || 'area_kaneshie');
  const [districtName, setDistrictName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please grant photo gallery permission to upload your Face ID photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Image picker error', e);
    }
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email/phone and password.');
      return;
    }
    setIsSubmitting(true);
    const result = loginWithEmail(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
      else if (navigation) navigation.navigate('Main');
    } else {
      Alert.alert('Authentication Failed', result.message || 'Invalid credentials');
    }
  };

  const handleRequestAccess = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !regPassword.trim()) {
      Alert.alert('Required Fields', 'Please fill in all required fields including password.');
      return;
    }

    if (role === 'super_admin') {
      const isFirst = users.length === 0;
      registerSuperAdmin({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: regPassword,
        profilePhoto: profilePhoto || undefined,
      });
      if (isFirst) {
        Alert.alert(
          'Root Administrator Initialized',
          'As the first registered user, your General Headquarters Administrator account has been activated immediately.',
          [{ text: 'Proceed', onPress: () => onLoginSuccess?.() || navigation?.navigate('Main') }]
        );
      } else {
        Alert.alert(
          'Request Submitted',
          'Your Headquarters Administrator request has been submitted for verification.',
          [{ text: 'OK', onPress: () => setAuthView('login') }]
        );
      }
    } else if (role === 'area_head') {
      if (!areaName.trim()) {
        Alert.alert('Area Required', 'Please enter the Area name you are heading.');
        return;
      }
      registerAreaHead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: regPassword,
        titlePrefix: 'Apostle',
        areaName: areaName.trim(),
        region: 'Ghana',
        country: 'Ghana',
        profilePhoto: profilePhoto || undefined,
      });
      Alert.alert(
        'Request Submitted',
        'Your Area Head registration has been sent to General Headquarters for verification.',
        [{ text: 'OK', onPress: () => setAuthView('login') }]
      );
    } else {
      if (!districtName.trim()) {
        Alert.alert('District Required', 'Please enter your District name.');
        return;
      }
      const chosenArea = areas.find((a) => a.id === pastorAreaId);
      registerPastor({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: regPassword,
        titlePrefix: 'Pastor',
        areaId: pastorAreaId,
        areaName: chosenArea?.name || 'Kaneshie Area',
        districtName: districtName.trim(),
        profilePhoto: profilePhoto || undefined,
      });
      Alert.alert(
        'Request Submitted',
        'Your District Pastor registration has been sent to your Area Head for verification.',
        [{ text: 'OK', onPress: () => setAuthView('login') }]
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/cop_convention_center.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      {/* Deep Navy Gradient Overlay */}
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Official Emblem Centerpiece */}
          <View style={styles.header}>
            <View style={styles.emblemCard}>
              <Image
                source={require('../../assets/cop_emblem_circle.png')}
                style={styles.emblemImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.churchTitle}>THE CHURCH OF PENTECOST</Text>
            <Text style={styles.appTitle}>COP CONNECT</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>OFFICIAL MINISTERIAL INTRANET</Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {authView === 'login' ? (
              // LOGIN VIEW
              <View style={styles.form}>
                <Text style={styles.formTitle}>Ministerial Sign In</Text>
                <Text style={styles.formSubtitle}>
                  Enter your verified Church of Pentecost ministerial credentials.
                </Text>

                <Text style={styles.inputLabel}>Official Email or Phone</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color="#0B2545" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="pastor@thecophq.org"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color="#0B2545" style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  style={styles.goldBtn}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#091B33" />
                  ) : (
                    <Text style={styles.goldBtnText}>LOG IN TO INTRANET</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.requestAccessRow}>
                  <Text style={styles.requestAccessPrompt}>New Minister or Apostle? </Text>
                  <TouchableOpacity onPress={() => setAuthView('request_access')}>
                    <Text style={styles.requestAccessLink}>Request Access</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // REQUEST ACCESS VIEW
              <View style={styles.form}>
                <TouchableOpacity
                  onPress={() => setAuthView('login')}
                  style={styles.backBtn}
                >
                  <ArrowLeft size={16} color="#0B2545" />
                  <Text style={styles.backBtnText}>Back to Sign In</Text>
                </TouchableOpacity>

                <Text style={styles.formTitle}>Request Ministerial Access</Text>
                <Text style={styles.formSubtitle}>
                  Access is strictly gated. Select your claimed office and submit for verification.
                </Text>

                {/* Role Selector */}
                <Text style={styles.inputLabel}>Ecclesiastical Office</Text>
                <View style={styles.roleGrid}>
                  <TouchableOpacity
                    onPress={() => setRole('pastor')}
                    style={[styles.roleOption, role === 'pastor' && styles.roleOptionActive]}
                  >
                    <Users size={16} color={role === 'pastor' ? '#FFFFFF' : '#0B2545'} />
                    <Text style={[styles.roleOptionText, role === 'pastor' && styles.roleOptionTextActive]}>
                      District Pastor
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRole('area_head')}
                    style={[styles.roleOption, role === 'area_head' && styles.roleOptionActive]}
                  >
                    <UserCheck size={16} color={role === 'area_head' ? '#FFFFFF' : '#0B2545'} />
                    <Text style={[styles.roleOptionText, role === 'area_head' && styles.roleOptionTextActive]}>
                      Area Head
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRole('super_admin')}
                    style={[styles.roleOption, role === 'super_admin' && styles.roleOptionActive]}
                  >
                    <Shield size={16} color={role === 'super_admin' ? '#FFFFFF' : '#0B2545'} />
                    <Text style={[styles.roleOptionText, role === 'super_admin' && styles.roleOptionTextActive]}>
                      Headquarters
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Portrait Photo Upload */}
                <Text style={styles.inputLabel}>Face ID Portrait Photo</Text>
                <TouchableOpacity onPress={handlePickImage} style={styles.photoUploadBox}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoUploadPlaceholder}>
                      <Camera size={24} color="#0B2545" />
                      <Text style={styles.photoUploadText}>Upload Official Portrait</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text style={styles.inputLabel}>Full Name & Title *</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Apostle Dr. Michael Prempeh"
                  placeholderTextColor="#94A3B8"
                  style={styles.singleInput}
                />

                <Text style={styles.inputLabel}>Official Email *</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="pastor@thecophq.org"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  style={styles.singleInput}
                />

                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+233 24 000 0000"
                  placeholderTextColor="#94A3B8"
                  style={styles.singleInput}
                />

                {role === 'area_head' && (
                  <>
                    <Text style={styles.inputLabel}>Area Name You Are Heading *</Text>
                    <TextInput
                      value={areaName}
                      onChangeText={setAreaName}
                      placeholder="e.g. Cape Coast Area"
                      placeholderTextColor="#94A3B8"
                      style={styles.singleInput}
                    />
                  </>
                )}

                {role === 'pastor' && (
                  <>
                    <Text style={styles.inputLabel}>District Name *</Text>
                    <TextInput
                      value={districtName}
                      onChangeText={setDistrictName}
                      placeholder="e.g. Darkuman District"
                      placeholderTextColor="#94A3B8"
                      style={styles.singleInput}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Set Password *</Text>
                <TextInput
                  value={regPassword}
                  onChangeText={setRegPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  style={styles.singleInput}
                />

                <TouchableOpacity onPress={handleRequestAccess} style={styles.goldBtn}>
                  <Text style={styles.goldBtnText}>SUBMIT ACCESS REQUEST</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Note */}
          <Text style={styles.footerNote}>
            Vision 2028: Possessing the Nations &bull; The Church of Pentecost
          </Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 27, 51, 0.88)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emblemCard: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  emblemImage: {
    width: 80,
    height: 80,
  },
  churchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  appTitle: {
    color: '#F1B51C',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  badge: {
    marginTop: 6,
    backgroundColor: 'rgba(241, 181, 28, 0.15)',
    borderColor: 'rgba(241, 181, 28, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#F1B51C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#091B33',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#091B33',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#091B33',
  },
  singleInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#091B33',
  },
  goldBtn: {
    backgroundColor: '#F1B51C',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#F1B51C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  goldBtnText: {
    color: '#091B33',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  requestAccessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  requestAccessPrompt: {
    fontSize: 11,
    color: '#64748B',
  },
  requestAccessLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#002D72',
    textDecorationLine: 'underline',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#002D72',
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  roleOptionActive: {
    backgroundColor: '#002D72',
    borderColor: '#002D72',
  },
  roleOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#091B33',
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
  photoUploadBox: {
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoUploadPlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  photoUploadText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#091B33',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  footerNote: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
  },
});
