import { View, Text, StyleSheet } from 'react-native';

export default function ProdutoCard({ produto }) {
  return (
    <View style={styles.card}>

      <Text style={styles.titulo}>
        {produto.title}
      </Text>

      <Text style={styles.preco}>
        R$ {produto.price.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    elevation: 3,
    flexWrap: 'wrap'
  },

  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#222222',
  },

  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16803c',
    marginTop: 8,
  },
});
