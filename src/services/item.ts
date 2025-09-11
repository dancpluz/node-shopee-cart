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
  const itemResponseActions = await prompts({
    type: "select",
    name: "action",
    message: "What do you want to do?",
    choices: [
      { title: "Increase item quantity", value: "increase" },
      { title: "Decrease item quantity", value: "decrease" },
      { title: "Remove item", value: "remove" },
      { title: "Back", value: "back" },
    ]
  });

  switch (itemResponseActions.action) {
    case "increase": {
      await increaseItemQuantity(cart, selectedItemId);
      break;
    }
    case "decrease": {
      await decreaseItemQuantity(cart, selectedItemId);
      break;
    }
    case "remove": {
      await removeItem(cart, selectedItemId);
      break;
    }
    case "back": {
      break;
    }
  }
  return;
}