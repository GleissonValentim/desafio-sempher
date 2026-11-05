import * as SQLite from 'expo-sqlite';

// abrir o banco de dados
export const dbPromise = SQLite.openDatabaseAsync('loja.db');

// Tabela de produtos
export async function criarTabelaProdutos() {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      imagem TEXT
    );
  `);
}

// Salvar os produtos no banco de dados
export async function salvarProdutos(produtos) {
  const db = await dbPromise;

  for (const produto of produtos) {
    await db.runAsync(
      `INSERT OR REPLACE INTO produtos (id, nome, preco, imagem)
       VALUES (?, ?, ?, ?);`,
      [
        produto.id,
        produto.title,
        produto.price,
        produto.thumbnail
      ]
    );
  }
}

// Buscar produtos salvos no banco de dados
export async function buscarProdutos() {
  const db = await dbPromise;

  const produtos = await db.getAllAsync(
    'SELECT * FROM produtos;'
  );

  return produtos;
}

// Criar a tabela do carrinho
export async function criarTabelaCarrinho() {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS carrinho (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      imagem TEXT,
      quantidade INTEGER NOT NULL DEFAULT 1
    );
  `);
}

// Buscar os produtos do carrinho
export async function buscarCarrinho() {
  const db = await dbPromise;

  const itens = await db.getAllAsync(
    'SELECT * FROM carrinho;'
  );

  return itens;
}

// Adicionar produto ao carrinho
export async function adicionarAoCarrinho(produto) {
  const db = await dbPromise;

  await db.runAsync(
    `INSERT INTO carrinho (id, nome, preco, imagem, quantidade)
     VALUES (?, ?, ?, ?, 1)
     ON CONFLICT(id) DO UPDATE SET
     quantidade = quantidade + 1;`,
    [
      produto.id,
      produto.title,
      produto.price,
      produto.thumbnail
    ]
  );
}

// Remover produto do carrinho
export async function removerProdutoDoCarrinho(id) {
  const db = await dbPromise;

  await db.runAsync(
    'DELETE FROM carrinho WHERE id = ?;',
    [id]
  );
}

// Atualizar quantidade de um produto no carrinho
export async function atualizarQuantidade(id, quantidade) {
  const db = await dbPromise;

  // Remover o produto se a quantidade igual a zero
  if (quantidade <= 0) {
    await removerProdutoDoCarrinho(id);
    return;
  }

  await db.runAsync(
    'UPDATE carrinho SET quantidade = ? WHERE id = ?;',
    [quantidade, id]
  );
}

// Criar tabela de operações pendentes (especifico para quando não a internet)
export async function criarTabelaOperacoes() {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS operacoes_pendentes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER,
      sincronizado INTEGER DEFAULT 0
    );
  `);
}

// Criar tabela para saber qual operação está pendente
export async function registrarOperacao(produtoId, tipo, quantidade) {
  const db = await dbPromise;

  await db.runAsync(
    `INSERT INTO operacoes_pendentes
     (produto_id, tipo, quantidade)
     VALUES (?, ?, ?);`,
    [produtoId, tipo, quantidade]
  );
}

// Buscar operações que ainda não foram sincronizadas
export async function buscarOperacoesPendentes() {
  const db = await dbPromise;

  const operacoes = await db.getAllAsync(
    `SELECT * FROM operacoes_pendentes
     WHERE sincronizado = 0
     ORDER BY id ASC;`
  );

  return operacoes;
}

// Marcar uma operação como sincronizada
export async function marcarOperacaoSincronizada(id) {
  const db = await dbPromise;

  await db.runAsync(
    `UPDATE operacoes_pendentes
     SET sincronizado = 1
     WHERE id = ?;`,
    [id]
  );
}

export async function listarTodasOperacoes() {
  const db = await dbPromise;

  return await db.getAllAsync(
    'SELECT * FROM operacoes_pendentes ORDER BY id ASC;'
  );
}