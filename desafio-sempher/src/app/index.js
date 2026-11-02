import { useEffect, useState } from 'react';

import { View, Text, FlatList, ActivityIndicator, StyleSheet, } from 'react-native';

import { getProdutos } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProdutos() {
    try {
      setLoading(true);
      setError(null);

      const data = await getProdutos();

      setProdutos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
    }
  }

  // Guardar os produtos vindos da API
  useEffect(() => {
    loadProdutos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16803c" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Minha Loja</Text>

      <Text style={styles.subtitle}>
        Produtos disponíveis
      </Text>

      {/* Mostrar os produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <ProdutoCard produto={item} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 55,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#222222',
  },

  subtitle: {
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    color: '#666666',
  },

  list: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
