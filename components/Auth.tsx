import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthProps {
    onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

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
                });
                if (error) throw error;
                // Show success banner and switch to login
                setSignUpSuccess(true);
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLogin();
            }
        } catch (error: any) {
            Alert.alert('SYSTEM_ERROR', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <View style={styles.header}>
                    <LinearGradient
                        colors={['#00ff41', 'transparent']}
                        style={styles.logoGlow}
                    />
                    <Lock size={60} color="#00ff41" style={styles.logoIcon} />
                    <Text style={styles.title}>SHADOW // NET</Text>
                    <Text style={styles.subtitle}>SECURE_ACCESS_TERMINAL</Text>
                </View>

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

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Mail size={20} color="#00ff41" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="AGENT_ID (EMAIL)"
                            placeholderTextColor="#444"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock size={20} color="#00ff41" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="ACCESS_CODE (PASSWORD)"
                            placeholderTextColor="#444"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
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
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
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
        shadowColor: '#00ff41',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e0e0e0',
        fontFamily: 'Courier',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 255, 65, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 12,
        color: '#00ff41',
        fontFamily: 'Courier',
        marginTop: 5,
        letterSpacing: 1,
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
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        color: '#00ff41',
        fontFamily: 'Courier',
        fontSize: 14,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 4,
        marginTop: 10,
        shadowColor: '#00ff41',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
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
    successBanner: {
        backgroundColor: 'rgba(0, 255, 65, 0.08)',
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
        fontSize: 16,
        marginBottom: 8,
    },
    successText: {
        color: '#aaa',
        fontFamily: 'Courier',
        fontSize: 13,
        lineHeight: 20,
    },
});
