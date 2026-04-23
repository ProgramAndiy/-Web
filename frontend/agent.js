class BakeryAgent {
  constructor({ products = [], deliveryFee = 0, freeDeliveryFrom = 0, contact = {}, hours = '' } = {}) {
    this.products = products;
    this.deliveryFee = deliveryFee;
    this.freeDeliveryFrom = freeDeliveryFrom;
    this.contact = contact;
    this.hours = hours;
  }

  formatPrice(value) {
    return `${value} грн`;
  }

  findProduct(name) {
    const normalized = name.toLowerCase().trim();
    return this.products.find(product => product.name.toLowerCase().includes(normalized));
  }

  productList(query) {
    const normalized = query.toLowerCase().trim();
    return this.products.filter(product => product.name.toLowerCase().includes(normalized) || product.category.toLowerCase().includes(normalized));
  }

  respond(message, cart = []) {
    const text = message.toLowerCase().trim();
    if (!text) {
      return 'Напишіть, будь ласка, що вас цікавить. Я підкажу про товари, доставку або замовлення.';
    }

    if (/(ціна|скільки|вартість)/.test(text)) {
      const productNames = this.products.map(p => p.name.toLowerCase());
      const found = productNames.find(name => text.includes(name));
      if (found) {
        const product = this.findProduct(found);
        return `Ціна ${product.name} — ${this.formatPrice(product.price)} за штуку.`;
      }
      return 'Напишіть назву товару, щоб я сказав ціну. Наприклад: «Скільки коштує круасан?»';
    }

    if (/(доставк|доставляє|доставка)/.test(text)) {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const fee = subtotal >= this.freeDeliveryFrom ? 0 : this.deliveryFee;
      return `Ми доставляємо по Львівщині. Доставка коштує ${fee === 0 ? '0 грн — безкоштовно!' : this.formatPrice(fee)}. Безкоштовна доставка від ${this.formatPrice(this.freeDeliveryFrom)}.`;
    }

    if (/(кошик|cart|замовлення|покупок)/.test(text)) {
      if (cart.length === 0) {
        return 'Ваш кошик поки що порожній. Додайте товари, і я допоможу завершити оформлення.';
      }
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      return `У кошику ${count} ${count === 1 ? 'товар' : count < 5 ? 'товари' : 'товарів'} на суму ${this.formatPrice(total)}.`;
    }

    if (/(адрес|де|знаход|міст|Львів)/.test(text)) {
      return `Наша пекарня знаходиться за адресою ${this.contact.address}. Телефон: ${this.contact.phone}. Email: ${this.contact.email}.`;
    }

    if (/(год|час|працює|режим|графік)/.test(text)) {
      return `Ми працюємо за графіком: ${this.hours}.`; 
    }

    if (/(товар|продукт|меню|список)/.test(text)) {
      const matched = this.productList(text);
      if (matched.length === 1) {
        const product = matched[0];
        return `${product.name}: ${product.desc} Ціна — ${this.formatPrice(product.price)}.`;
      }
      if (matched.length > 1) {
        return `Я знайшов кілька товарів: ${matched.slice(0, 4).map(p => p.name).join(', ')}. Напишіть точну назву, і я скажу більше.`;
      }
      return 'Скажіть, яке саме печиво або випічку ви шукаєте, і я підкажу.';
    }

    return 'Я допомагаю з цінами, доставкою, місцем знаходження, товарами та оформленням замовлення. Спробуйте: «Скільки коштує багет?» або «Як працює доставка?»';
  }
}

window.BakeryAgent = BakeryAgent;
