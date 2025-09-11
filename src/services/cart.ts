import { Item } from "./item";
import { colors } from "../utils";

export interface Cart {
  items: Item[]
  totalPrice: number
}

export async function addItem(cart: Cart, item: Item) {
  cart.items.push(item);
  cart.totalPrice += item.price * item.quantity;
  console.log(colors.green, `✅ Item "${item.name}" added to the cart!`, colors.reset);
}

export async function removeItem(cart: Cart, itemId: number) {
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    const item = cart.items[itemIndex]!;
    cart.totalPrice -= item.price * item.quantity;
    cart.items.splice(itemIndex, 1);
    console.log(colors.red, `🗑️ Item "${item.name}" removed from the cart.`, colors.reset);
  }
}

export async function clearCart(cart: Cart) {
  if (cart.items.length === 0) return;
  cart.items = [];
  cart.totalPrice = 0;
  console.log(colors.yellow, "🛒 Cart cleared.", colors.reset);
}

export async function increaseItemQuantity(cart: Cart, itemId: number) {
  const item = cart.items.find(item => item.id === itemId);
  if (item) {
    item.quantity++;
    cart.totalPrice += item.price;
    console.log(colors.blue, `➕ Quantity of "${item.name}" increased to ${item.quantity}.`, colors.reset);
  }
}

export async function decreaseItemQuantity(cart: Cart, itemId: number) {
  const item = cart.items.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    cart.totalPrice -= item.price;
    console.log(colors.blue, `➖ Quantity of "${item.name}" decreased to ${item.quantity}.`, colors.reset);
  } else if (item && item.quantity === 1) {
    await removeItem(cart, itemId);
  }
}