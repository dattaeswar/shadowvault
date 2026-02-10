import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const router = useRouter();

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('ACCESS_DENIED', 'Both AGENT_ID and ACCESS_CODE are required.');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: 'https://shadow-vault-two.vercel.app',
                    },
                });
                if (error) throw error;
                setSignUpSuccess(true);
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Auth state change in _layout.tsx will handle navigation
            }
        } catch (error: any) {
            Alert.alert('SYSTEM_ERROR', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        {/* Header */}
                        <View style={styles.header}>
                            <LinearGradient
                                colors={['#00ff41', 'transparent']}
                                style={styles.logoGlow}
                            />
                            <Lock size={60} color="#00ff41" style={styles.logoIcon} />
                            <Text style={styles.title}>SHADOW // NET</Text>
                            <Text style={styles.subtitle}>SECURE_ACCESS_TERMINAL</Text>
                        </View>

                        {/* Success Banner */}
                        {signUpSuccess && (
                            <View style={styles.successBanner}>
                                <Text style={styles.successIcon}>✓ UPLINK_ESTABLISHED</Text>
                                <Text style={styles.successText}>
                                    A verification link has been sent to your email.{'\n'}
                                    Please verify your account, then return here and{'\n'}
                                    login with the same credentials.
                                </Text>
                            </View>
                        )}

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Mail size={20} color="#00ff41" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="AGENT_ID (EMAIL)"
                                    placeholderTextColor="#555"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Lock size={20} color="#00ff41" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ACCESS_CODE (PASSWORD)"
                                    placeholderTextColor="#555"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoComplete="password"
                                />
                            </View>

                            <TouchableOpacity onPress={handleAuth} activeOpacity={0.8} disabled={loading}>
                                <LinearGradient
                                    colors={['#00ff41', '#009926']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="black" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>
                                                {isSignUp ? 'INITIATE_UPLINK' : 'ENTER_MATRIX'}
                                            </Text>
                                            <ArrowRight size={20} color="black" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsSignUp(!isSignUp);
                                    setSignUpSuccess(false);
                                }}
                                style={styles.switchButton}
                            >
                                <Text style={styles.switchText}>
                                    {isSignUp
                                        ? '[ ALREADY_HAVE_ACCESS? LOGIN ]'
                                        : '[ NEW_OPERATIVE? SIGN_UP ]'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <Text style={styles.footer}>// SHADOW_VAULT v1.0 // ENCRYPTED_CHANNEL //</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0d0d0d',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        maxWidth: isWeb ? 440 : undefined,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 8,
        padding: 32,
        ...(isWeb
            ? {
                // @ts-ignore — web-only shadow
                boxShadow: '0px 0px 40px rgba(0, 255, 65, 0.08)',
            }
            : {
                shadowColor: '#00ff41',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 30,
                elevation: 10,
            }),
    },
    header: {
        alignItems: 'center',
        marginBottom: 36,
        position: 'relative',
    },
    logoGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.2,
        top: -20,
    },
    logoIcon: {
        marginBottom: 10,
    },
    title: {
        fontSize: isWeb ? 28 : 26,
        fontWeight: 'bold',
        color: '#e0e0e0',
        fontFamily: 'Courier',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 255, 65, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 11,
        color: '#00ff41',
        fontFamily: 'Courier',
        marginTop: 5,
        letterSpacing: 1,
    },
    successBanner: {
        backgroundColor: 'rgba(0, 255, 65, 0.06)',
        borderWidth: 1,
        borderColor: '#00ff41',
        borderRadius: 4,
        padding: 16,
        marginBottom: 24,
    },
    successIcon: {
        color: '#00ff41',
        fontFamily: 'Courier',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 8,
    },
    successText: {
        color: '#999',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 14,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: Platform.OS === 'web' ? 14 : 16,
        color: '#00ff41',
        fontFamily: 'Courier',
        fontSize: 14,
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 4,
        marginTop: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Courier',
        marginRight: 8,
        letterSpacing: 1,
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchText: {
        color: '#666',
        fontFamily: 'Courier',
        fontSize: 12,
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        color: '#333',
        fontFamily: 'Courier',
        fontSize: 10,
        letterSpacing: 1,
    },
});
