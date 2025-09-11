export interface Item {
  id: number
  name: string
  price: number
  quantity: number
}

export async function createItem(name: string, price: number, quantity: number) {
  const item: Item = {
    id: Date.now(),
    name,
    price,
    quantity
  };
  return item;
}