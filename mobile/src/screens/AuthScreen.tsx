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
import { Shield, UserCheck, Users, Camera, Lock, Mail, Phone, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react-native';

export const AuthScreen: React.FC<{ navigation?: any; onLoginSuccess?: () => void }> = ({
  navigation,
  onLoginSuccess,
}) => {
  const { loginWithEmail, registerSuperAdmin, registerAreaHead, registerPastor, users } = useAuth();
  const { areas } = useData();

  // View state: 'splash' | 'login' | 'request_access'
  const [authView, setAuthView] = useState<'splash' | 'login' | 'request_access'>('splash');
  const [role, setRole] = useState<'super_admin' | 'area_head' | 'pastor'>('pastor');

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          
          {/* Card Frame */}
          <View style={styles.cardFrame}>
            
            {/* Centerpiece Halo & Badge */}
            <View style={styles.haloWrapper}>
              <View style={styles.haloRing} />
              <View style={styles.raisedBadge}>
                <Image
                  source={require('../../assets/cop_emblem_circle.png')}
                  style={styles.emblemImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Wordmark Titles */}
            <View style={styles.wordmarkContainer}>
              <Text style={styles.d1}>THE CHURCH OF PENTECOST</Text>
              <Text style={styles.d2}>
                COP <Text style={styles.d2Em}>Connect</Text>
              </Text>
            </View>

            {/* Gold Divider */}
            <View style={styles.divider} />

            <Text style={styles.tagline}>Official ministerial intranet</Text>

            {/* VIEW 1: HERO SPLASH MODE */}
            {authView === 'splash' && (
              <View style={styles.splashActions}>
                <TouchableOpacity
                  onPress={() => setAuthView('login')}
                  style={styles.goldCta}
                >
                  <Text style={styles.goldCtaText}>Continue to sign in</Text>
                  <ArrowRight size={16} color="#241C08" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAuthView('request_access')}
                  style={styles.secondaryCta}
                >
                  <UserCheck size={14} color="#D4A017" />
                  <Text style={styles.secondaryCtaText}>Request access</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* VIEW 2: SIGN IN FORM MODE */}
            {authView === 'login' && (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <TouchableOpacity
                    onPress={() => setAuthView('splash')}
                    style={styles.backBtn}
                  >
                    <ArrowLeft size={14} color="#D4A017" />
                    <Text style={styles.backBtnText}>Overview</Text>
                  </TouchableOpacity>
                  <Text style={styles.formModeLabel}>Sign In</Text>
                </View>

                <Text style={styles.inputLabel}>Official Email or Phone</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={15} color="#DCE3F2" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="pastor@copconnect.org"
                    placeholderTextColor="#726C60"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={15} color="#DCE3F2" style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="#726C60"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <EyeOff size={15} color="#DCE3F2" />
                    ) : (
                      <Eye size={15} color="#DCE3F2" />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  style={styles.goldCta}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#241C08" />
                  ) : (
                    <Text style={styles.goldCtaText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAuthView('request_access')}
                  style={styles.requestLink}
                >
                  <Text style={styles.requestLinkText}>New here? Request access</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* VIEW 3: REQUEST ACCESS VIEW */}
            {authView === 'request_access' && (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <TouchableOpacity
                    onPress={() => setAuthView('splash')}
                    style={styles.backBtn}
                  >
                    <ArrowLeft size={14} color="#D4A017" />
                    <Text style={styles.backBtnText}>Back</Text>
                  </TouchableOpacity>
                  <Text style={styles.formModeLabel}>Request Access</Text>
                </View>

                {/* Role Selector */}
                <Text style={styles.inputLabel}>Office</Text>
                <View style={styles.roleRow}>
                  <TouchableOpacity
                    onPress={() => setRole('pastor')}
                    style={[styles.roleChip, role === 'pastor' && styles.roleChipActive]}
                  >
                    <Users size={12} color={role === 'pastor' ? '#241C08' : '#DCE3F2'} />
                    <Text style={[styles.roleChipText, role === 'pastor' && styles.roleChipTextActive]}>Pastor</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRole('area_head')}
                    style={[styles.roleChip, role === 'area_head' && styles.roleChipActive]}
                  >
                    <UserCheck size={12} color={role === 'area_head' ? '#241C08' : '#DCE3F2'} />
                    <Text style={[styles.roleChipText, role === 'area_head' && styles.roleChipTextActive]}>Area Head</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRole('super_admin')}
                    style={[styles.roleChip, role === 'super_admin' && styles.roleChipActive]}
                  >
                    <Shield size={12} color={role === 'super_admin' ? '#241C08' : '#DCE3F2'} />
                    <Text style={[styles.roleChipText, role === 'super_admin' && styles.roleChipTextActive]}>HQ</Text>
                  </TouchableOpacity>
                </View>

                {/* Portrait Upload */}
                <Text style={styles.inputLabel}>Face ID Photo</Text>
                <TouchableOpacity onPress={handlePickImage} style={styles.photoBox}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.photoImg} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Camera size={18} color="#D4A017" />
                      <Text style={styles.photoText}>Attach Portrait</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Pastor Isaac Mensah"
                  placeholderTextColor="#726C60"
                  style={styles.singleInput}
                />

                <Text style={styles.inputLabel}>Official Email *</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="pastor@thecophq.org"
                  placeholderTextColor="#726C60"
                  autoCapitalize="none"
                  style={styles.singleInput}
                />

                <Text style={styles.inputLabel}>Phone *</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+233 24 000 0000"
                  placeholderTextColor="#726C60"
                  style={styles.singleInput}
                />

                {role === 'area_head' && (
                  <>
                    <Text style={styles.inputLabel}>Area Name *</Text>
                    <TextInput
                      value={areaName}
                      onChangeText={setAreaName}
                      placeholder="e.g. Cape Coast Area"
                      placeholderTextColor="#726C60"
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
                      placeholderTextColor="#726C60"
                      style={styles.singleInput}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Set Password *</Text>
                <TextInput
                  value={regPassword}
                  onChangeText={setRegPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#726C60"
                  secureTextEntry
                  style={styles.singleInput}
                />

                <TouchableOpacity onPress={handleRequestAccess} style={styles.goldCta}>
                  <Text style={styles.goldCtaText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footText}>Vision 2028 — Possessing the Nations</Text>
            </View>
          </View>
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
    backgroundColor: 'rgba(9, 15, 32, 0.90)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFrame: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(6, 11, 24, 0.82)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 22,
    paddingVertical: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  haloWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haloRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 2.5,
    borderColor: '#D4A017',
    borderTopColor: '#C0392B',
    borderRightColor: '#D4A017',
    borderBottomColor: 'transparent',
    borderLeftColor: '#D4A017',
  },
  raisedBadge: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  emblemImage: {
    width: '100%',
    height: '100%',
  },
  wordmarkContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  d1: {
    color: '#DCE3F2',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  d2: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 3,
  },
  d2Em: {
    color: '#D4A017',
    fontStyle: 'italic',
    fontWeight: '700',
  },
  divider: {
    width: 46,
    height: 2,
    backgroundColor: '#D4A017',
    marginVertical: 12,
  },
  tagline: {
    color: '#C6CEE4',
    fontSize: 12.5,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  splashActions: {
    width: '100%',
    marginTop: 22,
    gap: 10,
  },
  goldCta: {
    backgroundColor: '#D4A017',
    paddingVertical: 13,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#D4A017',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  goldCtaText: {
    color: '#241C08',
    fontWeight: '700',
    fontSize: 13.5,
  },
  secondaryCta: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryCtaText: {
    color: '#DCE3F2',
    fontSize: 12.5,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    marginTop: 14,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    color: '#DCE3F2',
    fontSize: 11.5,
    fontWeight: '600',
  },
  formModeLabel: {
    color: '#D4A017',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  inputLabel: {
    color: '#DCE3F2',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 12,
    color: '#FFFFFF',
  },
  singleInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#FFFFFF',
  },
  eyeBtn: {
    padding: 4,
  },
  requestLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  requestLinkText: {
    color: '#C6CEE4',
    fontSize: 11.5,
    textDecorationLine: 'underline',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 7,
    borderRadius: 4,
  },
  roleChipActive: {
    backgroundColor: '#D4A017',
    borderColor: '#D4A017',
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DCE3F2',
  },
  roleChipTextActive: {
    color: '#241C08',
  },
  photoBox: {
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoText: {
    fontSize: 11,
    color: '#DCE3F2',
    fontWeight: '600',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    marginTop: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    alignItems: 'center',
  },
  footText: {
    color: '#8695BC',
    fontSize: 10.5,
    letterSpacing: 0.4,
  },
});
