import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';

const db = SQLite.openDatabase('seaman.db');

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [expiring, setExpiring] = useState(0);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, number TEXT, issue TEXT, expiry TEXT);'
      );
      tx.executeSql('SELECT * FROM documents', [], (_, { rows }) => {
        setDocs(rows._array);
        const today = new Date();
        const soon = rows._array.filter(d => {
          const exp = new Date(d.expiry);
          const diff = (exp - today) / (1000 * 60 * 60 * 24);
          return diff <= 90 && diff > 0;
        });
        setExpiring(soon.length);
      });
    });
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seaman Wallet</Text>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardNum}>{docs.length}</Text>
          <Text>Total Docs</Text>
        </View>
        <View style={[styles.card, {backgroundColor: '#FFE5E5'}]}>
          <Text style={[styles.cardNum, {color: 'red'}]}>{expiring}</Text>
          <Text>Expiring Soon</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.btn} onPress={() => Alert.alert('Add Document','Coming in v1.1')}>
        <Text style={styles.btnText}>+ Add Seaman Document</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btn} onPress={() => Alert.alert('CV Maker','Coming in v1.1')}>
        <Text style={styles.btnText}>Auto Make CV</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btn} onPress={() => Alert.alert('Profile','Coming in v1.1')}>
        <Text style={styles.btnText}>Profile & Family</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>v1.0 Lite - Document List + Expiry Tracker Working</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0B4F6C', marginBottom: 20, textAlign: 'center' },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#E5F4FF', padding: 20, borderRadius: 12, alignItems: 'center' },
  cardNum: { fontSize: 32, fontWeight: 'bold', color: '#0B4F6C' },
  btn: { backgroundColor: '#0B4F6C', padding: 18, borderRadius: 12, marginBottom: 12 },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  note: { textAlign: 'center', color: 'gray', marginTop: 20 }
});
