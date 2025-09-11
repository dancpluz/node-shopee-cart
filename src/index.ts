import prompts from "prompts";
import { addItem, Cart, deleteItem, lookAtCart } from "./services/cart";
import { createItem, itemActions } from "./services/item";

// actions: 
// add new item
// look at cart

const cart: Cart = {
  items: [],
  totalPrice: 0
};

let selectedItemId: number | null = null;

async function promptsMenu() {
  const onCancel = () => {
    console.log('bye');
    return false;
  }

  const actionResponse = await prompts({
    type: "select",
    name: "action",
    message: "What do you want to do?",
    choices: [
      { title: "Add new item", value: "add" },
      { title: `Look at your cart (${cart.items.length} items)`, value: "look", disabled: cart.items.length === 0 },
    ]
  }, { onCancel });

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

      const itemResponse = await prompts(questions, { onCancel });
      if (!itemResponse.name || !itemResponse.price || !itemResponse.quantity) {
        console.log('Invalid item data');
        return true;
      }
      const item = await createItem(itemResponse.name, itemResponse.price, itemResponse.quantity);
      await addItem(cart, item);
      return true;
    } 
    case "look": {
      const itemChoices = cart.items.map((item, idx) => ({
        title: `${idx + 1}. ${item.name} - Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}`,
        value: item.id
      }));
      itemChoices.push({ title: 'Back', value: -1 });

      const itemResponse = await prompts({
        type: "select",
        name: "id",
        message: "Select an item to view details:",
        choices: itemChoices
      }, { onCancel });

      selectedItemId = itemResponse.id;

      if (selectedItemId === null) return true;
      await itemActions(cart, selectedItemId);
      
      return true;
    }
  }
}

(async function main() {
  while (true) {
    const result = await promptsMenu();
    if (!result) break;
  }
})()