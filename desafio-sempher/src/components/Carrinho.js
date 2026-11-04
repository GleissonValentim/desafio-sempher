import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CarrinhoCard({ item, onRemover, atualizarQuantidade }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagem }}
        style={styles.imagem}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <Text style={styles.titulo}>{item.nome}</Text>

        <Text>Preço: R$ {item.preco.toFixed(2)}</Text>

        <Text>Quantidade: {item.quantidade}</Text>

        <Text>
          Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onAtualizarQuantidade(item.id, item.quantidade - 1)}
        >
            <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>

        <Text> {item.quantidade} </Text>

        <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onAtualizarQuantidade(item.id, item.quantidade + 1)}
        >
            <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => onRemover(item.id, item.nome)}
        >
        <Text style={styles.botaoText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },

  imagem: {
    width: 80,
    height: 80,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  titulo: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  botao: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },

  botaoText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
 },

  quantityButton: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
 },

  quantityText: {
    color: '#16803c',
    fontWeight: 'bold',
    fontSize: 18,
 },
});