Objetivo do projeto

Desenvolver um aplicativo mobile de loja virtual utilizando React Native, com consumo de API REST, armazenamento local e suporte ao funcionamento offline.

Funcionalidades implementadas

Listagem de produtos utilizando API REST.

Visualização dos detalhes dos produtos.

Adicionar e remover produtos do carrinho.

Aumentar e diminuir a quantidade de produtos.

Cálculo do subtotal e total do carrinho.

Armazenamento de produtos e carrinho no SQLite.

Consulta aos produtos armazenados quando estiver sem internet.

Identificação da conexão com a internet.

Registro de operações realizadas offline.

Sincronização das operações pendentes ao restabelecer a conexão.

Tecnologias utilizadas

React Native

JavaScript

Expo

SQLite

NetInfo

DummyJSON API

Instalação e execução

1. Pré-requisitos

Node.js instalado.

npm instalado.

Expo Go ou emulador Android/iOS.

2. Clonar o repositório

git clone URL_DO_REPOSITORIO

3. Entrar na pasta do projeto

cd NOME_DO_PROJETO

4. Instalar as dependências

npm install

5. Executar o aplicativo

npx expo start

Após iniciar, utilize o QR Code com o Expo Go ou execute o aplicativo em um emulador compatível.

API utilizada

O projeto utiliza a API pública DummyJSON:

https://dummyjson.com/

Endpoints utilizados:

GET /products: consulta os produtos.

GET /products/{id}: consulta os detalhes de um produto.

POST /carts/add: simula o envio de produtos ao carrinho.

Observação: a API DummyJSON simula as operações de escrita, não mantendo as alterações permanentemente no servidor.