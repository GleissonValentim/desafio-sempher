## Objetivo do projeto

Desenvolver um aplicativo mobile de loja virtual utilizando **React Native**, com consumo de **API REST**, armazenamento local e suporte ao funcionamento offline.

## Funcionalidades implementadas

- Listagem de produtos utilizando API REST.
- Visualização dos detalhes dos produtos.
- Adicionar e remover produtos do carrinho.
- Aumentar e diminuir a quantidade de produtos.
- Cálculo do subtotal e total do carrinho.
- Armazenamento de produtos e carrinho no **SQLite**.
- Consulta aos produtos armazenados quando estiver sem internet.
- Identificação da conexão com a internet.
- Registro de operações realizadas offline.
- Sincronização das operações pendentes ao restabelecer a conexão.

## Tecnologias utilizadas

- **React Native**
- **JavaScript**
- **Expo**
- **SQLite**
- **NetInfo**
- **DummyJSON API**

## Instalação e execução

### 1. Pré-requisitos

- **Node.js** instalado.
- **npm** instalado.
- **Expo Go** ou emulador Android/iOS.

### 2. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 3. Entrar na pasta do projeto

```bash
cd NOME_DO_PROJETO
```

### 4. Instalar as dependências

```bash
npm install
```

### 5. Executar o aplicativo

```bash
npx expo start
```

Após iniciar, utilize o **QR Code** com o Expo Go ou execute o aplicativo em um emulador compatível.

## API utilizada

O projeto utiliza a API pública **DummyJSON**:

https://dummyjson.com/

### Endpoints utilizados

- **GET /products:** consulta os produtos.
- **GET /products/{id}:** consulta os detalhes de um produto.
- **POST /carts/add:** simula o envio de produtos ao carrinho.

**Observação:** a API DummyJSON simula as operações de escrita, não mantendo as alterações permanentemente no servidor.

## Estrutura do banco de dados SQLite

O aplicativo utiliza o SQLite para armazenar localmente os dados, permitindo que os produtos e o carrinho continuem disponíveis mesmo quando não há conexão com a internet.

O banco de dados utilizado é o `loja.db`, composto por três tabelas:

**Tabela `produtos`:**
Armazena os produtos consultados pela API, permitindo que sejam exibidos posteriormente quando o aplicativo estiver offline.

- `id`: identificador do produto.
- `nome`: nome do produto.
- `preco`: preço do produto.
- `imagem`: imagem do produto.

**Tabela `carrinho`:**
Armazena os produtos adicionados ao carrinho e suas respectivas quantidades.

- `id`: identificador do produto.
- `nome`: nome do produto.
- `preco`: preço do produto.
- `imagem`: imagem do produto.
- `quantidade`: quantidade do produto no carrinho.

**Tabela `operacoes_pendentes`:**
Armazena as operações realizadas que ainda precisam ser enviadas para a API.

- `id`: identificador da operação.
- `produto_id`: identificador do produto relacionado à operação.
- `tipo`: tipo da operação (adicionar, atualizar ou remover).
- `quantidade`: quantidade relacionada à operação.
- `sincronizado`: indica se a operação já foi sincronizada (0 = pendente, 1 = sincronizada).

Os dados são armazenados localmente utilizando comandos SQL de inserção, consulta, atualização e exclusão.

## Funcionamento offline e sincronização

O aplicativo utiliza a biblioteca NetInfo para identificar se existe conexão com a internet.

**Funcionamento online:**

- Os produtos são consultados por meio da API DummyJSON.
- Os produtos recebidos são armazenados no SQLite.
- Ao adicionar um produto ao carrinho, ele é salvo localmente e a operação é enviada para a API.
- Caso ocorra uma falha no envio, a operação é registrada como pendente no banco de dados.

**Funcionamento offline:**

- Os produtos são carregados diretamente do SQLite.
- O usuário pode continuar adicionando, atualizando e removendo produtos do carrinho.
- As operações realizadas são registradas na tabela `operacoes_pendentes`.
- O aplicativo informa quando existem operações aguardando sincronização.

**Sincronização:**

Quando a conexão com a internet é restabelecida, o aplicativo identifica as operações pendentes, consulta o carrinho armazenado localmente e envia seus dados para a API DummyJSON.

Após o envio bem-sucedido, as operações são marcadas como sincronizadas no SQLite, evitando que sejam processadas novamente pelo mecanismo de sincronização.

