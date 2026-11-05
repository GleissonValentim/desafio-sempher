import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CarrinhoCard({ item, remover, atualizarQuantidade }) {
  return (
    <View style={styles.card}>

      <View style={styles.conteudo}>
        <Image
          source={{ uri: item.imagem }}
          style={styles.imagem}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text style={styles.titulo}>{item.nome}</Text>

          <Text>Preço: R$ {item.preco.toFixed(2)}</Text>

          <Text>Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.acoes}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => atualizarQuantidade(item.id, item.quantidade - 1)}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>

          <Text>{item.quantidade}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => atualizarQuantidade(item.id, item.quantidade + 1)}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => remover(item.id, item.nome)}
        >
          <Text style={styles.botaoText}>Remover</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },

  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imagem: {
    width: 75,
    height: 75,
    flexShrink: 0,
  },

  info: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  titulo: {
    fontWeight: 'bold',
    marginBottom: 5,
    flexShrink: 1,
  },

  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },

  quantityText: {
    color: '#16803c',
    fontWeight: 'bold',
    fontSize: 18,
  },

  botao: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },

  botaoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});