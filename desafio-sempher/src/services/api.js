// Acessar os produtos da API
export async function getProdutos() {
  const resposta = await fetch(
    'https://dummyjson.com/products'
  );

  if(!resposta.ok) {
    throw new Error('Não foi possível buscar os produtos.');
  }

  const data = await resposta.json();

  console.log(data);

  return data.products;
}

// Enviar o carrinho para a API
export async function sincronizarCarrinho(carrinho) {
  const resposta = await fetch(
    'https://dummyjson.com/carts/add',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        products: carrinho.map((produto) => ({
          id: produto.id,
          quantity: produto.quantidade,
        })),
      }),
    }
  );

  if (!resposta.ok) {
    throw new Error('Não foi possível sincronizar o carrinho.');
  }

  return await resposta.json();
}