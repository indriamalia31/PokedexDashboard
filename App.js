import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null); 
  const [selectedType, setSelectedType] = useState('ALL'); 
  const [useAxiosStyle, setUseAxiosStyle] = useState(false); 

  const categories = ['ALL', 'FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'NORMAL'];

  const fetchPokemonData = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);

      let data;
      const targetUrl = 'https://pokeapi.co/api/v2/pokemon?limit=50';

      if (useAxiosStyle) {
        console.log('Fetching data via Axios Client Simulation...');
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Axios Network Error: Status 500');
        const axiosJson = await response.json();
        data = axiosJson.results;
      } else {
    
        console.log('Fetching data via Native Fetch API...');
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Fetch Network Error: Status ' + response.status);
        const fetchJson = await response.json();
        data = fetchJson.results;
      }

      const detailedData = await Promise.all(
        data.map(async (item) => {
          const detailRes = await fetch(item.url);
          const detailJson = await detailRes.json();
          return {
            id: detailJson.id,
            name: item.name.toUpperCase(),
            image: detailJson.sprites.other['official-artwork'].front_default || detailJson.sprites.front_default,
            type: detailJson.types[0].type.name.toUpperCase(),
            height: detailJson.height,
            weight: detailJson.weight,
            abilities: detailJson.abilities.map(a => a.ability.name).join(', '),
            stats: detailJson.stats
          };
        })
      );

      setPokemonList(detailedData);
      applyFilterAndSearch(detailedData, searchQuery, selectedType);
    } catch (err) {
      setError(err.message || 'Gagal memuat ekosistem Pokémon.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [useAxiosStyle]);

  const applyFilterAndSearch = (masterList, search, type) => {
    let tempData = [...masterList];

    if (search.trim() !== '') {
      tempData = tempData.filter(p => p.name.includes(search.toUpperCase()));
    }

    if (type !== 'ALL') {
      tempData = tempData.filter(p => p.type === type);
    }

    setFilteredPokemon(tempData);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilterAndSearch(pokemonList, text, selectedType);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    applyFilterAndSearch(pokemonList, searchQuery, type);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPokemonData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF5A5F" />
        <Text style={styles.loadingText}>Menghubungkan ke Lab Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Koneksi Terganggu</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPokemonData}>
          <Text style={styles.retryText}>Inisialisasi Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPokemonCard = ({ item }) => {
    // Penentuan warna background card estetik berdasarkan tipe dominan
    const bgColors = { FIRE: '#FDEAEC', WATER: '#EAF4FE', GRASS: '#EAF7EE', ELECTRIC: '#FEF9E7', NORMAL: '#F1F3F5' };
    const textColors = { FIRE: '#E53E3E', WATER: '#3182CE', GRASS: '#38A169', ELECTRIC: '#D69E2E', NORMAL: '#4A5568' };
    const cardBg = bgColors[item.type] || '#F8F9FA';
    const tagColor = textColors[item.type] || '#718096';

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: cardBg }]} 
        onPress={() => setSelectedPokemon(item)}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardId}>#{String(item.id).padStart(3, '0')}</Text>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: '#FFFFFF', borderColor: tagColor, borderWidth: 1 }]}>
            <Text style={[styles.typeBadgeText, { color: tagColor }]}>{item.type}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pokédex Dashboard</Text>
          <Text style={styles.headerSubtitle}>Sistem Informasi API Integration</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.toggleButton, { backgroundColor: useAxiosStyle ? '#4D96FF' : '#FF6B6B' }]}
          onPress={() => setUseAxiosStyle(!useAxiosStyle)}
        >
          <Text style={styles.toggleText}>Engine: {useAxiosStyle ? 'Axios' : 'Fetch'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Cari Pokémon favoritmu..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {categories.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, selectedType === type && styles.activeChip]}
              onPress={() => handleTypeSelect(type)}
            >
              <Text style={[styles.chipText, selectedType === type && styles.activeChipText]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.rowWrapper}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#FF5A5F']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Pokémon tidak ditemukan di laboratorium ini.</Text>
          </View>
        }
      />

      {selectedPokemon && (
        <Modal animationType="slide" transparent={true} visible={!!selectedPokemon}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalId}>#{String(selectedPokemon.id).padStart(3, '0')}</Text>
              <Text style={styles.modalTitle}>{selectedPokemon.name}</Text>
              
              <Image source={{ uri: selectedPokemon.image }} style={styles.modalImage} />
              
              <View style={styles.specRow}>
                <View style={styles.specBox}><Text style={styles.specLabel}>Tinggi</Text><Text style={styles.specVal}>{selectedPokemon.height / 10} m</Text></View>
                <View style={styles.specBox}><Text style={styles.specLabel}>Tipe</Text><Text style={styles.specVal}>{selectedPokemon.type}</Text></View>
                <View style={styles.specBox}><Text style={styles.specLabel}>Berat</Text><Text style={styles.specVal}>{selectedPokemon.weight / 10} kg</Text></View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Kemampuan (Abilities)</Text>
                <Text style={styles.infoBody}>{selectedPokemon.abilities}</Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPokemon(null)}>
                <Text style={styles.closeButtonText}>Kembali ke Katalog</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#4A5568', fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, pb: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  headerSubtitle: { fontSize: 12, color: '#718096' },
  toggleButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  toggleText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  searchBoxContainer: { paddingHorizontal: 16, marginTop: 14 },
  searchBar: { height: 46, backgroundColor: '#edf2f7', borderRadius: 12, paddingHorizontal: 16, fontSize: 14, color: '#2D3748' },
  chipsContainer: { marginVertical: 12, height: 36 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#E2E8F0', borderRadius: 20, marginRight: 8, justifyContent: 'center' },
  activeChip: { backgroundColor: '#1A202C' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#4A5568' },
  activeChipText: { color: '#FFFFFF' },
  listContainer: { paddingHorizontal: 12, paddingBottom: 20 },
  rowWrapper: { justifyContent: 'space-between' },
  card: { flex: 0.48, borderRadius: 16, padding: 12, marginBottom: 14, alignItems: 'center', elevation: 1 },
  cardImage: { width: 85, height: 85, resizeMode: 'contain' },
  cardContent: { width: '100%', marginTop: 8, alignItems: 'flex-start' },
  cardId: { fontSize: 10, color: '#718096', fontWeight: 'bold' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginVertical: 2 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginTop: 4 },
  typeBadgeText: { fontSize: 9, fontWeight: 'bold' },
  emptyView: { width: '100%', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#718096', fontSize: 14, textAlign: 'center' },
  errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#E53E3E', marginBottom: 6 },
  errorSub: { color: '#718096', marginBottom: 16, textAlign: 'center' },
  retryButton: { backgroundColor: '#E53E3E', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center' },
  modalId: { fontSize: 14, fontWeight: 'bold', color: '#A0AEC0' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', textTransform: 'uppercase', marginBottom: 10 },
  modalImage: { width: 160, height: 160, resizeMode: 'contain', marginVertical: 10 },
  specRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 16 },
  specBox: { alignItems: 'center' },
  specLabel: { fontSize: 11, color: '#A0AEC0', marginBottom: 2 },
  specVal: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  infoSection: { width: '100%', backgroundColor: '#F7FAFC', padding: 14, borderRadius: 12, marginBottom: 20 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: '#4A5568', marginBottom: 4 },
  infoBody: { fontSize: 13, color: '#718096', textTransform: 'capitalize' },
  closeButton: { backgroundColor: '#1A202C', width: '100%', py: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});