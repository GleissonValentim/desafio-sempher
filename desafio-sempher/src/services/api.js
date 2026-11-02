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