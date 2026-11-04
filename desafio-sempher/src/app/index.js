import { useEffect, useState } from 'react';

import { View, Text, FlatList, ActivityIndicator, StyleSheet, } from 'react-native';

import NetInfo from '@react-native-community/netinfo';

import { getProdutos } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';
import { criarTabelaProdutos, salvarProdutos, buscarProdutos, criarTabelaCarrinho, adicionarAoCarrinho, buscarCarrinho, removerDoCarrinho} from '../services/database';
import Carrinho from '../components/Carrinho';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrinho, setCarrinho] = useState([]);

  // Calcular o preco total do carrinho
  const totalCarrinho = carrinho.reduce( (total, item) => total + item.preco * item.quantidade,0);

  // Valida se há conexão com a internet
  const [online, setOnline] = useState(true);

  // Valida se há conexão com a internet
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  async function loadProdutos() {
    try {
      setLoading(true);
      setError(null);

      // Verificar a conexão atual
      const conexao = await NetInfo.fetch();

      if (conexao.isConnected) {

        const data = await getProdutos();

        // Guardar os produtos no banco de dados
        await salvarProdutos(data);

        setProdutos(data);

      } else {

        // Se a API falhar, buscar os produtos no banco de dados
        const produtosSalvos = await buscarProdutos();

        if (produtosSalvos.length > 0) {
          setProdutos(
            produtosSalvos.map((produto) => ({
              id: produto.id,
              title: produto.nome,
              price: produto.preco,
              thumbnail: produto.imagem
            }))
          )

          console.log('Produtos carregados com sucesso')
          console.log(produtosSalvos)
        } else {
          setError('Não foi possível carregar os produtos.');
        }
      }
    } catch (err) {
      setError('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }

  // Adicionar produto ao carrinho
  async function AdicionarProduto(produto) {
    try {
      await adicionarAoCarrinho(produto);

      const itens = await buscarCarrinho();

      setCarrinho(itens);

      console.log(`Produto ${produto.title} adicionado ao carrinho!`);
    } catch (error) {
      console.log('Erro ao adicionar produto ao carrinho:', error);
    }
  }

  // Remover produto do carrinho
  async function removerProdutoDoCarrinho(id, nome) {
    try {
      await removerDoCarrinho(id);

      const itens = await buscarCarrinho();

      setCarrinho(itens);

      console.log(`Produto ${nome} removido do carrinho!`);
    } catch (error) {
      console.log('Erro ao remover produto do carrinho:', error);
    }
  }

  // Ao iniciar a aplicação
  useEffect(() => {
    async function iniciar() {
      try {

        // Criar a tabela de produtos no banco de dados
        await criarTabelaProdutos();

        // Criar a tabela do carrinho no banco de dados
        await criarTabelaCarrinho();

        // Guardar os produtos vindos da API
        await loadProdutos();

        // Carregar os produtos do carrinho do banco de dados
        const itens = await buscarCarrinho();

        setCarrinho(itens);
      } catch (err) {
        
        setError(err.message);
        setLoading(false);
      }
    }

    iniciar();
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

      <View style={styles.meuCarrinho}>
        <Text style={styles.heading}>Meu carrinho ({carrinho.length})</Text>

        {carrinho.length === 0 ? (
          <Text style={styles.subtitle}>Seu carrinho está vazio.</Text>
        ) : (
          carrinho.map((item) => (
            <Carrinho
              key={item.id}
              item={item}
              onRemover={removerProdutoDoCarrinho}
            />
          ))
        )}
      </View>

      <Text style={styles.heading}>Minha Loja</Text>

      <Text style={styles.subtitle}> Produtos disponíveis </Text>

      {/* Mostrar os produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <ProdutoCard produto={item} onAdicionar={AdicionarProduto} />
        )}
        contentContainerStyle={styles.list}
      />

      <Text style={styles.heading}>
        Total: R$ {totalCarrinho.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingLeft: 10,
    paddingRight: 10
  },

  meuCarrinho: {
    marginTop: 30,
    marginBottom: 30
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
