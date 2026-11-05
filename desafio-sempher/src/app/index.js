import { useEffect, useState } from 'react';

import { View, Text, FlatList, ActivityIndicator, StyleSheet, } from 'react-native';

import NetInfo from '@react-native-community/netinfo';

import { getProdutos, sincronizarCarrinho } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';
import { criarTabelaProdutos, salvarProdutos, buscarProdutos, criarTabelaCarrinho, adicionarAoCarrinho, buscarCarrinho, 
  removerProdutoDoCarrinho, atualizarQuantidade, registrarOperacao, buscarOperacoesPendentes, marcarOperacaoSincronizada, listarTodasOperacoes, criarTabelaOperacoes} from '../services/database';
import Carrinho from '../components/Carrinho';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [operacoesPendentes, setOperacoesPendentes] = useState(0);

  // Calcular o preco total do carrinho
  const totalCarrinho = carrinho.reduce( (total, item) => total + item.preco * item.quantidade,0);

  // Valida se há conexão com a internet
  const [online, setOnline] = useState(true);

  // Valida se há conexão com a internet
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const conectado =
        state.isConnected &&
        state.isInternetReachable !== false;

      setOnline(conectado);

      if (conectado) {
        sincronizarOperacoes().catch((erro) => {
          console.log('Erro ao sincronizar:', erro);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadProdutos() {
    try {
      setLoading(true);
      setError(null);

      // Verificar a conexão atual
      const conexao = await NetInfo.fetch();

      if (conexao.isConnected && conexao.isInternetReachable !== false) {
        try {

          const data = await getProdutos();

          // Salvar os produtos no banco de dados
          await salvarProdutos(data);

          setProdutos(data);

        } catch (erro) {

          // Se a API falhar, buscar no banco
          console.log('API indisponível. Buscando produtos localmente.');

          const produtosSalvos = await buscarProdutos();

          if (produtosSalvos.length > 0) {
            setProdutos(produtosSalvos.map((produto) => ({
              id: produto.id,
              title: produto.nome,
              price: produto.preco,
              thumbnail: produto.imagem
            })));
          } else {
            setError('Não há produtos salvos para exibir offline.');
          }
        }

      } else {
        // Se estiver offline, buscar diretamente no banco
        const produtosSalvos = await buscarProdutos();

        if (produtosSalvos.length > 0) {
          setProdutos(produtosSalvos.map((produto) => ({
            id: produto.id,
            title: produto.nome,
            price: produto.preco,
            thumbnail: produto.imagem
          })));
        } else {
          setError('Não há produtos salvos para exibir offline.');
        }
      }

    } catch (err) {
      console.log('Erro ao carregar produtos:', err);
      setError('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }

  // Adicionar produto ao carrinho
  async function AdicionarProduto(produto) {
    try {
  
      // Localmente
      await adicionarAoCarrinho(produto);

      if (online) {
        try {

          // Envia a inclusão do produto para a API
          await sincronizarCarrinho([
            {
              id: produto.id,
              quantidade: 1
            }
          ]);

          console.log('Produto enviado para a API!');
        } catch (erroAPI) {

          // Se a API falhar, registra para sincronizar depois
          await registrarOperacao(
            produto.id,
            'adicionar',
            1
          );

          console.log('Falha na API. Operação registrada como pendente.');
        }
      } else {

        // Sem internet, registra a operação como pendente
        await registrarOperacao(
          produto.id,
          'adicionar',
          1
        );
      }

      // Atualizar a quantidade de operações pendentes
      await atualizarOperacoesPendentes();

      // Atualiza o carrinho na tela
      const itens = await buscarCarrinho();
      setCarrinho(itens);

      console.log(`${produto.title} adicionado ao carrinho!`);

    } catch (error) {
      console.log('Erro ao adicionar produto:', error);
    }
  }

  // Atualiza a quantidade de produtos no carrinho
  async function AtualizarQuantidadeCarrinho(id, quantidade) {
    try {
      await atualizarQuantidade(id, quantidade);

      if (!online) {
        await registrarOperacao(
           id,
          'atualizar',
          quantidade
        );
      }

      await atualizarOperacoesPendentes();

      const itens = await buscarCarrinho();

      setCarrinho(itens);
    } catch (error) {
      console.log('Erro ao atualizar quantidade:', error);
    }
  }

  async function removerProdutoCarrinho(id, nome) {
    try {
      await removerProdutoDoCarrinho(id);

      if (!online) {
        await registrarOperacao(
          id,
          'remover',
          0
        );
      }

      await atualizarOperacoesPendentes();

      const itens = await buscarCarrinho();
      setCarrinho(itens);

    } catch (error) {
      console.log('Erro ao remover produto do carrinho:', error);
    }
  }

  async function sincronizarOperacoes() {

    // Buscar operações pendentes
    const operacoes = await buscarOperacoesPendentes();

    // Se não houver operações, não precisa sincronizar
    if (operacoes.length === 0) {
      return;
    }

    // Buscar o carrinho atualizado no banco de dados
    const carrinhoAtual = await buscarCarrinho();

    // Enviar o carrinho para a API
    await sincronizarCarrinho(carrinhoAtual);

    // Marcar todas as operações como sincronizadas
    for (const operacao of operacoes) {
      await marcarOperacaoSincronizada(operacao.id);
    }

    const TestesAPI = await buscarCarrinho();
    console.log('Carrinho sincronizado com sucesso!');
  }

  async function atualizarOperacoesPendentes() {
    const operacoes = await buscarOperacoesPendentes();

    setOperacoesPendentes(operacoes.length);
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

        // Criar a tabela de operações pendentes no banco de dados
        await criarTabelaOperacoes();

        await atualizarOperacoesPendentes();

        // Carregar os produtos do carrinho do banco de dados
        const itens = await buscarCarrinho();

        setCarrinho(itens);

        const teste = await listarTodasOperacoes();

        console.log('Operações pendentes:', teste);
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

      {operacoesPendentes > 0 && (
        <View style={styles.avisoPendente}>
          <Text style={styles.textoPendente}>
            Existem {operacoesPendentes} operações aguardando sincronização.
          </Text>
        </View>
      )}

      <View style={styles.meuCarrinho}>
        <Text style={styles.heading}>Meu carrinho ({carrinho.length})</Text>

        {carrinho.length === 0 ? (
          <Text style={styles.subtitle}>Seu carrinho está vazio.</Text>
        ) : (
          carrinho.map((item) => (
            <Carrinho
              key={item.id}
              item={item}
              remover={removerProdutoCarrinho}
              atualizarQuantidade={AtualizarQuantidadeCarrinho}
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

  avisoPendente: {
    backgroundColor: '#fff3cd',
    padding: 12,
    margin: 10,
    borderRadius: 8,
  },

  textoPendente: {
    color: '#856404',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
