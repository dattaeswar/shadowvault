import { Cpu, LogOut, ShieldAlert, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error: any) {
            Alert.alert('SYSTEM_ERROR', error.message);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            '⚠️ CRITICAL_SEQUENCE',
            'You are about to initiate SELF-DESTRUCT. This will permanently erase your agent identity and all encrypted secrets. This cannot be undone.',
            [
                { text: 'ABORT', style: 'cancel' },
                {
                    text: 'CONFIRM_DELETION',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { error } = await supabase.rpc('delete_user');
                            if (error) throw error;

                            // RPC might delete the user, but we should also sign out locally
                            await supabase.auth.signOut();
                            Alert.alert('SUCCESS', 'Account purged. All data has been erased.');
                        } catch (error: any) {
                            Alert.alert('SYSTEM_ERROR', 'Failed to purge account: ' + error.message);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Cpu size={40} color="#00ff41" style={styles.headerIcon} />
                <Text style={styles.title}>AGENT // SETTINGS</Text>
                <Text style={styles.subtitle}>SECURE_CONFIGURATION_MODULE</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>// STATUS</Text>
                <View style={styles.statusCard}>
                    <ShieldCheck size={20} color="#00ff41" />
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusText}>UPLINK_STABLE</Text>
                        <Text style={styles.statusDetail}>Encryption: AES-256-GCM</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>// ACTIONS</Text>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <LogOut size={20} color="#e0e0e0" />
                    <Text style={styles.buttonText}>TERMINATE_SESSION</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.dangerButton]}
                    onPress={handleDeleteAccount}
                    disabled={loading}
                >
                    <ShieldAlert size={20} color="#ff3333" />
                    <Text style={styles.dangerButtonText}>INITIATE_SELF_DESTRUCT</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>SHADOW_VAULT_OS v1.0.4</Text>
                <Text style={styles.footerText}>BUILT_FOR_SHADOWS</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    headerIcon: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e0e0e0',
        fontFamily: 'Courier',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 10,
        color: '#00ff41',
        fontFamily: 'Courier',
        marginTop: 4,
        letterSpacing: 1,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Courier',
        marginBottom: 16,
        letterSpacing: 1,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#00ff4133',
        borderRadius: 4,
        padding: 16,
    },
    statusInfo: {
        marginLeft: 12,
    },
    statusText: {
        color: '#00ff41',
        fontFamily: 'Courier',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusDetail: {
        color: '#555',
        fontFamily: 'Courier',
        fontSize: 10,
        marginTop: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 4,
        padding: 16,
        marginBottom: 12,
    },
    buttonText: {
        color: '#e0e0e0',
        fontFamily: 'Courier',
        fontSize: 14,
        marginLeft: 12,
        fontWeight: '600',
    },
    dangerButton: {
        borderColor: '#ff333344',
        marginTop: 20,
    },
    dangerButtonText: {
        color: '#ff3333',
        fontFamily: 'Courier',
        fontSize: 14,
        marginLeft: 12,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        opacity: 0.3,
    },
    footerText: {
        color: '#666',
        fontFamily: 'Courier',
        fontSize: 10,
        marginBottom: 4,
        letterSpacing: 1,
    },
});
