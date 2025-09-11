import prompts from "prompts";
import { addItem, Cart, deleteItem } from "./services/cart";
import { createItem } from "./services/item";

// actions: 
// add new item
// look at cart
// select item

const cart: Cart = {
  items: [],
  totalPrice: 0
};

async function promptsMenu() {

  const actionResponse = await prompts({
    type: "select",
    name: "action",
    message: "What do you want to do?",
    choices: [
      { title: "Add new item", value: "add" },
      { title: `Look at your cart (${cart.items.length} items)`, value: "look", disabled: cart.items.length === 0 },
      { title: "Select item", value: "select" }
    ]
  });

  switch (actionResponse.action) {
    case "add": {
      const questions = [
        {
          type: 'text' as const,
          name: 'name',
          message: 'What is the item name?'
        },
        {
          type: 'number' as const,
          name: 'price',
          message: 'What is the item price?',
          validate: (value: number) => value > 0 ? true : 'Price must be greater than 0'
        },
        {
          type: 'number' as const,
          name: 'quantity',
          message: 'What is the item quantity?',
          validate: (value: number) => value > 0 ? true : 'Quantity must be greater than 0',
          initial: 1
        }
      ];

      const itemResponse = await prompts(questions);
      const item = await createItem(itemResponse.name, itemResponse.price, itemResponse.quantity);
      await addItem(cart, item);
      break;
    }
  }
}

(async function main() {
  await promptsMenu();
  
  const item = await createItem("Item 1", 100, 2);
  await addItem(cart, item);
  await addItem(cart, await createItem("Item 4", 234, 1));
  console.log(cart);

  await deleteItem(cart, item.id);
  console.log(cart);
})()