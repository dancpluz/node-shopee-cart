import prompts from "prompts";
import { Cart, decreaseItemQuantity, increaseItemQuantity, removeItem } from "./cart";

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

export async function itemActions(cart: Cart, selectedItemId: number) {
  const selectedItem = cart.items.find(item => item.id === selectedItemId);
  if (!selectedItem) return;

  const itemResponseActions = await prompts({
    type: "select",
    name: "action",
    message: `What would you like to do with "${selectedItem.name}"?`,
    choices: [
      { title: "➕ Increase quantity", value: "increase" },
      { title: "➖ Decrease quantity", value: "decrease" },
      { title: "🗑️ Remove item from cart", value: "remove" },
      { title: "↩️ Go back", value: "back" },
    ]
  });

  switch (itemResponseActions.action) {
    case "increase":
      await increaseItemQuantity(cart, selectedItemId);
      break;
    case "decrease":
      await decreaseItemQuantity(cart, selectedItemId);
      break;
    case "remove":
      await removeItem(cart, selectedItemId);
      break;
    case "back":
      break;
  }
}