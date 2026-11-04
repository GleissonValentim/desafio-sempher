import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProdutoCard({ produto, onAdicionar }) {
  return (
    <View style={styles.card}>

      <Image 
        source={{ uri: produto.thumbnail }}
        style={styles.imagem}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>
        {produto.title}
      </Text>

      <Text style={styles.preco}>
        R$ {produto.price.toFixed(2)}
      </Text>

      <TouchableOpacity style={styles.botao}  onPress={() => onAdicionar(produto)}>
        <Text style={styles.botaoText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
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

  imagem: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },

  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16803c',
    marginTop: 8,
  },

  botao: {
    backgroundColor: '#16803c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  }, 

  botaoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
