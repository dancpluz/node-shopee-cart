import { Item } from "./item";

export interface Cart {
  items: Item[]
  totalPrice: number
}

// add item
// remove item
// lower item quantity
// increase item quantity
// clear cart
// total price

export async function addItem(cart: Cart, item: Item) {
  cart.items.push(item);
  cart.totalPrice += item.price * item.quantity;
}

export async function removeItem(cart: Cart, itemId: number) {
  const itemIndex = cart.items.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    const item = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    cart.totalPrice -= item.price * item.quantity;
  }
}

export async function clearCart(cart: Cart) {
  cart.items = [];
  cart.totalPrice = 0;
}

export async function increaseItemQuantity(cart: Cart, itemId: number) {
  const item = cart.items.find(item => item.id === itemId);
  if (item) {
    item.quantity++;
    cart.totalPrice += item.price;
  }
}

export async function decreaseItemQuantity(cart: Cart, itemId: number) {
  const item = cart.items.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    cart.totalPrice -= item.price;
  } else if (item && item.quantity === 1) {
    await removeItem(cart, itemId);
  }
}