import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';

export default function ProdutoCard({ produto, onAdicionar }) {

  const [modalVisivel, setModalVisivel] = useState(false);

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

      <TouchableOpacity
        style={styles.botaoDetalhes}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={styles.botaoDetalhesText}>
          Ver detalhes
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>

            <Image
              source={{ uri: produto.thumbnail }}
              style={styles.imagemModal}
              resizeMode="contain"
            />

            <Text style={styles.titulo}>
              {produto.title}
            </Text>

            <Text>
              {produto.description || 'Descrição não disponível.'}
            </Text>

            <Text style={styles.preco}>
              R$ {produto.price.toFixed(2)}
            </Text>

            <Text>
              Categoria: {produto.category || 'Não informada'}
            </Text>

            <Text>
              Avaliação: {produto.rating || 'Não disponível'}
            </Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.botaoText}>
                Fechar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}
  
const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    margin: 5,
    elevation: 3,
    minWidth: 0,
  },

  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#222222',
    flexShrink: 1,
  },

  botao: {
    backgroundColor: '#16803c',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },

  imagem: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
  },

  botaoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  botaoDetalhes: {
    backgroundColor: '#eeeeee',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },

  botaoDetalhesText: {
    color: '#222222',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  conteudoModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    gap: 10,
  },

  imagemModal: {
    width: '100%',
    height: 180,
  },
});
