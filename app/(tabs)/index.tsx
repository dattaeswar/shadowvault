import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-url-polyfill/auto';

import Auth from '../../components/Auth';
import { supabase } from '../../lib/supabase';

// --- Types ---
interface Secret {
  id: number;
  created_at?: string;
  title: string;
  value: string;
}

export default function TabOneScreen() {
  const [session, setSession] = useState<any>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [syncing, setSyncing] = useState(false);

  // --- Database Logic ---

  const fetchSecrets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('secrets')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setSecrets(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSecret = async () => {
    if (!title || !value) {
      Alert.alert('Error', 'Please enter both Title and Secret Value.');
      return;
    }

    try {
      setSyncing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('secrets')
        .insert([{ title, value, user_id: user.id }]);

      if (error) {
        throw error;
      }

      setTitle('');
      setValue('');
      await fetchSecrets(); // Reload list
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const deleteSecret = async (id: number) => {
    try {
      setSyncing(true);
      const { error } = await supabase
        .from('secrets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSecrets(); // Reload list
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchSecrets();
      else setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchSecrets();
      else setSecrets([]);
    });
  }, []);

  if (!session) {
    return <Auth onLogin={() => { }} />;
  }

  // --- UI Components ---

  const renderItem = ({ item }: { item: Secret }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Lock size={16} color="#00ff41" />
      </View>
      <View style={styles.codeBlock}>
        <Text style={styles.codeText}>{item.value}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteSecret(item.id)}
      >
        <Trash2 size={20} color="#ff3333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SHADOW // VAULT</Text>
        <View style={styles.syncContainer}>
          <TouchableOpacity onPress={() => supabase.auth.signOut()} style={{ marginRight: 15 }}>
            <Text style={[styles.syncText, { color: '#ff3333' }]}>[LOGOUT]</Text>
          </TouchableOpacity>
          {syncing || loading ? (
            <ActivityIndicator size="small" color="#00ff41" />
          ) : (
            <View style={styles.onlineDot} />
          )}
          <Text style={styles.syncText}>{syncing || loading ? 'SYNCING...' : 'SECURE'}</Text>
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="SECRET // TITLE"
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="ENCRYPTED_VALUE..."
          placeholderTextColor="#444"
          value={value}
          onChangeText={setValue}
          multiline
        />

        <TouchableOpacity onPress={addSecret} activeOpacity={0.8}>
          <LinearGradient
            colors={['#00ff41', '#00cc33']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.encryptButton}
          >
            <Lock size={20} color="black" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>ENCRYPT & SAVE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Vault List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>VAULT // INDEX</Text>
        {loading && secrets.length === 0 ? (
          <ActivityIndicator size="large" color="#00ff41" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={secrets}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>[NO_DATA_FOUND]</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Courier', // Fallback for monospace feel
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    color: '#00ff41',
    fontSize: 12,
    marginLeft: 5,
    fontFamily: 'Courier',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff41',
    boxShadow: '0px 0px 5px rgba(0, 255, 65, 0.8)', // Neon green glow
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#00ff41',
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    fontFamily: 'Courier',
    borderRadius: 4,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  encryptButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 4,
    boxShadow: '0px 0px 10px rgba(0, 255, 65, 0.5)', // Neon green glow
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    padding: 0,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cardTitle: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  codeBlock: {
    padding: 15,
    backgroundColor: '#0d0d0d',
  },
  codeText: {
    color: '#00ff41',
    fontSize: 12,
    fontFamily: 'Courier',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
  },
  emptyText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Courier',
    fontStyle: 'italic',
  },
});
