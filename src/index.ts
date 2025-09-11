import prompts from "prompts";
import { addItem, Cart, clearCart } from "./services/cart";
import { createItem, itemActions } from "./services/item";
import { colors } from "./utils";

const cart: Cart = {
  items: [],
  totalPrice: 0
};

async function promptsMenu(): Promise<boolean> {
  const onCancel = () => {
    console.log(colors.red, "\n👋 Operation cancelled. See you later!", colors.reset);
    return false;
  }

  const actionResponse = await prompts({
    type: "select",
    name: "action",
    message: "What would you like to do?",
    choices: [
      { title: "🛍️ Add new item", value: "add" },
      { title: `🛒 View my cart (${cart.items.length} items)`, value: "look", disabled: cart.items.length === 0 },
      { title: "🚪 Exit", value: "exit" }
    ]
  }, { onCancel });

  if (actionResponse.action === 'exit') {
    console.log(colors.green, "\n👋 Thank you for using the cart simulator! See you again.", colors.reset);
    return false;
  }

  switch (actionResponse.action) {
    case "add": {
      console.log(colors.cyan, "\n--- ADD NEW ITEM ---", colors.reset);
      const itemResponse = await prompts([
        { type: 'text', name: 'name', message: "What is the item's name?" },
        { type: 'number', name: 'price', message: 'What is the price? (e.g., 10.50)', float: true, validate: v => v > 0 || 'Price must be greater than 0' },
        { type: 'number', name: 'quantity', message: 'What is the quantity?', initial: 1, validate: v => v > 0 || 'Quantity must be greater than 0' }
      ], { onCancel });

      if (itemResponse.name && itemResponse.price && itemResponse.quantity) {
        const item = await createItem(itemResponse.name, itemResponse.price, itemResponse.quantity);
        await addItem(cart, item);
      }
      break;
    }
    case "look": {
      console.clear();
      console.log(colors.cyan, "--- 🛒 YOUR SHOPPING CART 🛒 ---", colors.reset);

      cart.items.forEach((item, index) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        console.log(
          `  ${colors.bright}${index + 1}. ${item.name}${colors.reset}
     ${colors.dim}(Qty: ${item.quantity} x $${item.price.toFixed(2)}) -> Subtotal: $${subtotal}${colors.reset}`
        );
      });

      console.log(colors.yellow, "----------------------------------------", colors.reset);
      console.log(`${colors.bright}TOTAL: $${cart.totalPrice.toFixed(2)}${colors.reset}`);
      console.log(colors.yellow, "----------------------------------------\n", colors.reset);

      const itemChoices = cart.items.map((item, idx) => ({
        title: `${idx + 1}. ${item.name}`,
        value: item.id
      }));

      itemChoices.push({ title: '🗑️ Clear cart', value: -2 });
      itemChoices.push({ title: '↩️ Back to main menu', value: -1 });

      const itemResponse = await prompts({
        type: "select",
        name: "id",
        message: "Select an item to MANAGE or choose an action:",
        choices: itemChoices,
      }, { onCancel });

      if (itemResponse.id === null || itemResponse.id === -1) {
      } else if (itemResponse.id === -2) {
        await clearCart(cart);
      } else {
        await itemActions(cart, itemResponse.id);
      }
      break;
    }
  }

  return true;
}

(async function main() {
  console.clear();
  console.log(colors.magenta, "========================================", colors.reset);
  console.log(colors.magenta, `  ${colors.bright}🛒 Welcome to the Shopee Cart Simulator 🛒`, colors.reset);
  console.log(colors.magenta, "========================================\n", colors.reset);

  while (true) {
    console.clear();
    const result = await promptsMenu();
    if (!result) break;
  }
})()