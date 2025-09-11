import { addItem, Cart, deleteItem } from "./services/cart";
import { createItem } from "./services/item";

const cart: Cart = {
  items: [],
  totalPrice: 0
};

// actions: 
// add new item
// look at cart
// select item

(async function main() {
    const item = await createItem("Item 1", 100, 2);
    await addItem(cart, item);
    await addItem(cart, await createItem("Item 4", 234, 1));
    console.log(cart);

    await deleteItem(cart, item.id);
    console.log(cart);
})()