import { Item } from "./item";

interface Cart {
  items: Item[]
  totalPrice: number
}

// add item
// remove item
// lower item quantity
// increase item quantity
// clear cart
// total price

async function addItem(cart: Cart, item: Item) {}

async function removeItem(cart: Cart, itemId: number) {}

async function deleteItem(cart: Cart, itemId: number) {}

async function clearCart(cart: Cart) {}

async function increaseItemQuantity(cart: Cart, itemId: number) {}