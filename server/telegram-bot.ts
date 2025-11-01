import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";
import type { InsertProduct } from "@shared/schema";

interface UserSession {
  step: string;
  data: Partial<InsertProduct>;
  editingProductId?: string;
  currentDuration?: string;
  editingOptionId?: string;
}

const sessions = new Map<number, UserSession>();

export function initTelegramBot(token: string) {
  const bot = new TelegramBot(token, { 
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  });

  bot.on('polling_error', (error: any) => {
    if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
      console.log('Warning: Another bot instance is running. Stop other instances to use this bot.');
    } else {
      console.error('Polling error:', error);
    }
  });

  const categories = [
    "Subscriptions",
    "Combo Pack",
    "Adult",
    "Music",
    "Software",
    "Other Items"
  ];

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Welcome to SubFlix Product Manager! 🎬\n\nCommands:\n/newpost - Add a new product\n/showall - View all products with numbers\n/delpost - Delete a product\n/changeimg - Change product image\n/changedescription - Change product description\n/addoptions - Add options to existing product\n/deloptions - Delete options from product"
    );
  });

  bot.onText(/\/newpost/, (msg) => {
    const chatId = msg.chat.id;
    
    sessions.set(chatId, {
      step: "category",
      data: {}
    });

    const keyboard = {
      reply_markup: {
        inline_keyboard: categories.map(cat => [{
          text: cat,
          callback_data: `cat_${cat}`
        }])
      }
    };

    bot.sendMessage(
      chatId,
      "Please select a category for the product:",
      keyboard
    );
  });

  bot.onText(/\/showall/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map((product, index) => [{
            text: `${String(index + 1).padStart(4, '0')} - ${product.name} (${product.category})`,
            callback_data: `view_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "📋 All Products:\n\nSelect a product to view details:",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });

  bot.onText(/\/delpost/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map(product => [{
            text: `🗑️ ${product.name} (${product.category})`,
            callback_data: `delete_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "⚠️ Select a product to DELETE:\n(This action cannot be undone!)",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });

  bot.onText(/\/changeimg/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map(product => [{
            text: `🖼️ ${product.name} (${product.category})`,
            callback_data: `changeimg_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "Select a product to change image:",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });

  bot.onText(/\/changedescription/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map(product => [{
            text: `📝 ${product.name} (${product.category})`,
            callback_data: `changedesc_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "Select a product to change description:",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });

  bot.onText(/\/addoptions/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map(product => [{
            text: `➕ ${product.name} (${product.category})`,
            callback_data: `addopt_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "Select a product to add custom options:",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });

  bot.onText(/\/deloptions/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, "No products found. Use /newpost to add a product.");
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: products.map(product => [{
            text: `🗑️ ${product.name} (${product.category})`,
            callback_data: `delopt_${product.id}`
          }])
        }
      };

      bot.sendMessage(
        chatId,
        "Select a product to delete options:",
        keyboard
      );
    } catch (error) {
      bot.sendMessage(chatId, "❌ Error fetching products.");
    }
  });


  bot.on("callback_query", async (query) => {
    const chatId = query.message!.chat.id;
    const messageId = query.message!.message_id;
    const data = query.data;

    if (!data) {
      await bot.answerCallbackQuery(query.id);
      return;
    }

    const session = sessions.get(chatId);

    if (data.startsWith("cat_") && session?.step === "category") {
      const category = data.replace("cat_", "");
      session.data.category = category;
      session.step = "name";

      await bot.editMessageText(
        `Category selected: ${category}`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );

      bot.sendMessage(chatId, "Please enter the product name:");
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    if (data === "add_options" && session?.step === "pricing") {
      session.step = "add_pricing";
      
      await bot.answerCallbackQuery(query.id);
      bot.sendMessage(
        chatId,
        "Please enter pricing in format:\nlabel/actualPrice/sellingPrice\n\nExample: Premium HD/649/149\nExample: Family Plan/999/299\nExample: 1 Month Special/599/99\n\n✨ You can write any custom text as label!"
      );
      return;
    }
    
    if (data.startsWith("view_")) {
      const productId = data.replace("view_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const priceOptions = [];
      
      if (product.price1MonthActual > 0 && product.price1MonthSelling > 0) {
        priceOptions.push([
          {
            text: `1 Month: ₹${product.price1MonthActual} → ₹${product.price1MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_1_month_${productId}`
          },
          {
            text: product.inStock1Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_1_month_${productId}`
          }
        ]);
      }
      
      if (product.price3MonthActual > 0 && product.price3MonthSelling > 0) {
        priceOptions.push([
          {
            text: `3 Months: ₹${product.price3MonthActual} → ₹${product.price3MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_3_months_${productId}`
          },
          {
            text: product.inStock3Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_3_months_${productId}`
          }
        ]);
      }
      
      if (product.price6MonthActual > 0 && product.price6MonthSelling > 0) {
        priceOptions.push([
          {
            text: `6 Months: ₹${product.price6MonthActual} → ₹${product.price6MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_6_months_${productId}`
          },
          {
            text: product.inStock6Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_6_months_${productId}`
          }
        ]);
      }
      
      if (product.price12MonthActual > 0 && product.price12MonthSelling > 0) {
        priceOptions.push([
          {
            text: `12 Months: ₹${product.price12MonthActual} → ₹${product.price12MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_12_months_${productId}`
          },
          {
            text: product.inStock12Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_12_months_${productId}`
          }
        ]);
      }

      const customOptions = product.customOptions || [];
      for (const option of customOptions) {
        priceOptions.push([
          {
            text: `${option.label}: ₹${option.actualPrice} → ₹${option.sellingPrice}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_custom_${option.id}_${productId}`
          },
          {
            text: option.inStock ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_custom_${option.id}_${productId}`
          }
        ]);
      }

      await bot.editMessageText(
        `📦 ${product.name}\n\nCategory: ${product.category}\nDescription: ${product.description}\n\nClick ✏️ to edit price or stock icon to toggle availability:`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: priceOptions
          }
        }
      );
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    if (data.startsWith("edit_")) {
      const parts = data.replace("edit_", "").split("_");
      const productId = parts.pop()!;
      const duration = parts.join("_");
      
      sessions.set(chatId, {
        step: `editing_${duration}`,
        data: {},
        editingProductId: productId,
        currentDuration: duration
      });
      
      await bot.answerCallbackQuery(query.id);
      bot.sendMessage(
        chatId,
        `Enter new pricing for ${duration.replace("_", " ")} in format:\n${duration.replace("_", " ")}_actualPrice_sellingPrice\n\nExample: 1 Month_649_149`
      );
      return;
    }
    
    if (data.startsWith("toggle_")) {
      const parts = data.replace("toggle_", "").split("_");
      const productId = parts.pop()!;
      const duration = parts.join("_");
      
      const product = await storage.getProduct(productId);
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      let updateData: Partial<InsertProduct> = {};
      
      if (duration === "1_month") {
        updateData.inStock1Month = !product.inStock1Month;
      } else if (duration === "3_months") {
        updateData.inStock3Month = !product.inStock3Month;
      } else if (duration === "6_months") {
        updateData.inStock6Month = !product.inStock6Month;
      } else if (duration === "12_months") {
        updateData.inStock12Month = !product.inStock12Month;
      }

      await storage.updateProduct(productId, updateData);
      
      const updatedProduct = await storage.getProduct(productId);
      if (!updatedProduct) {
        await bot.answerCallbackQuery(query.id, { text: "Error updating" });
        return;
      }

      const priceOptions = [];
      
      if (updatedProduct.price1MonthActual > 0 && updatedProduct.price1MonthSelling > 0) {
        priceOptions.push([
          {
            text: `1 Month: ₹${updatedProduct.price1MonthActual} → ₹${updatedProduct.price1MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_1_month_${productId}`
          },
          {
            text: updatedProduct.inStock1Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_1_month_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price3MonthActual > 0 && updatedProduct.price3MonthSelling > 0) {
        priceOptions.push([
          {
            text: `3 Months: ₹${updatedProduct.price3MonthActual} → ₹${updatedProduct.price3MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_3_months_${productId}`
          },
          {
            text: updatedProduct.inStock3Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_3_months_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price6MonthActual > 0 && updatedProduct.price6MonthSelling > 0) {
        priceOptions.push([
          {
            text: `6 Months: ₹${updatedProduct.price6MonthActual} → ₹${updatedProduct.price6MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_6_months_${productId}`
          },
          {
            text: updatedProduct.inStock6Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_6_months_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price12MonthActual > 0 && updatedProduct.price12MonthSelling > 0) {
        priceOptions.push([
          {
            text: `12 Months: ₹${updatedProduct.price12MonthActual} → ₹${updatedProduct.price12MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_12_months_${productId}`
          },
          {
            text: updatedProduct.inStock12Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_12_months_${productId}`
          }
        ]);
      }

      const customOptions = updatedProduct.customOptions || [];
      for (const option of customOptions) {
        priceOptions.push([
          {
            text: `${option.label}: ₹${option.actualPrice} → ₹${option.sellingPrice}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_custom_${option.id}_${productId}`
          },
          {
            text: option.inStock ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_custom_${option.id}_${productId}`
          }
        ]);
      }

      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: priceOptions
        },
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id, { 
        text: `Stock status updated!` 
      });
      return;
    }

    if (data.startsWith("toggle_custom_")) {
      const parts = data.replace("toggle_custom_", "").split("_");
      const productId = parts.pop()!;
      const optionId = parts.join("_");
      
      const product = await storage.getProduct(productId);
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const customOptions = product.customOptions || [];
      const updatedCustomOptions = customOptions.map(option => {
        if (option.id === optionId) {
          return { ...option, inStock: !option.inStock };
        }
        return option;
      });

      await storage.updateProduct(productId, { customOptions: updatedCustomOptions });
      
      const updatedProduct = await storage.getProduct(productId);
      if (!updatedProduct) {
        await bot.answerCallbackQuery(query.id, { text: "Error updating" });
        return;
      }

      const priceOptions = [];
      
      if (updatedProduct.price1MonthActual > 0 && updatedProduct.price1MonthSelling > 0) {
        priceOptions.push([
          {
            text: `1 Month: ₹${updatedProduct.price1MonthActual} → ₹${updatedProduct.price1MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_1_month_${productId}`
          },
          {
            text: updatedProduct.inStock1Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_1_month_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price3MonthActual > 0 && updatedProduct.price3MonthSelling > 0) {
        priceOptions.push([
          {
            text: `3 Months: ₹${updatedProduct.price3MonthActual} → ₹${updatedProduct.price3MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_3_months_${productId}`
          },
          {
            text: updatedProduct.inStock3Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_3_months_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price6MonthActual > 0 && updatedProduct.price6MonthSelling > 0) {
        priceOptions.push([
          {
            text: `6 Months: ₹${updatedProduct.price6MonthActual} → ₹${updatedProduct.price6MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_6_months_${productId}`
          },
          {
            text: updatedProduct.inStock6Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_6_months_${productId}`
          }
        ]);
      }
      
      if (updatedProduct.price12MonthActual > 0 && updatedProduct.price12MonthSelling > 0) {
        priceOptions.push([
          {
            text: `12 Months: ₹${updatedProduct.price12MonthActual} → ₹${updatedProduct.price12MonthSelling}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_12_months_${productId}`
          },
          {
            text: updatedProduct.inStock12Month ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_12_months_${productId}`
          }
        ]);
      }

      const updatedCustomOptions2 = updatedProduct.customOptions || [];
      for (const option of updatedCustomOptions2) {
        priceOptions.push([
          {
            text: `${option.label}: ₹${option.actualPrice} → ₹${option.sellingPrice}`,
            callback_data: `noop`
          },
          {
            text: "✏️",
            callback_data: `edit_custom_${option.id}_${productId}`
          },
          {
            text: option.inStock ? "✅" : "🙅🏻‍♂️",
            callback_data: `toggle_custom_${option.id}_${productId}`
          }
        ]);
      }

      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: priceOptions
        },
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id, { 
        text: `Stock status updated!` 
      });
      return;
    }

    if (data.startsWith("edit_custom_")) {
      const parts = data.replace("edit_custom_", "").split("_");
      const productId = parts.pop()!;
      const optionId = parts.join("_");
      
      const product = await storage.getProduct(productId);
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const customOptions = product.customOptions || [];
      const option = customOptions.find(opt => opt.id === optionId);
      
      if (!option) {
        await bot.answerCallbackQuery(query.id, { text: "Option not found" });
        return;
      }

      sessions.set(chatId, {
        step: `editing_custom_option`,
        data: {},
        editingProductId: productId,
        editingOptionId: optionId
      });
      
      await bot.answerCallbackQuery(query.id);
      bot.sendMessage(
        chatId,
        `Enter new pricing for "${option.label}" in format:\nactualPrice/sellingPrice\n\nExample: 649/149`
      );
      return;
    }


    if (data === "create_product") {
      const session = sessions.get(chatId);
      if (!session) {
        await bot.answerCallbackQuery(query.id);
        return;
      }

      session.data.price1MonthActual = session.data.price1MonthActual || 0;
      session.data.price1MonthSelling = session.data.price1MonthSelling || 0;
      session.data.price3MonthActual = session.data.price3MonthActual || 0;
      session.data.price3MonthSelling = session.data.price3MonthSelling || 0;
      session.data.price6MonthActual = session.data.price6MonthActual || 0;
      session.data.price6MonthSelling = session.data.price6MonthSelling || 0;
      session.data.price12MonthActual = session.data.price12MonthActual || 0;
      session.data.price12MonthSelling = session.data.price12MonthSelling || 0;

      try {
        const product = await storage.createProduct(session.data as InsertProduct);
        
        const pricingLines = [];
        if (product.price1MonthActual > 0 && product.price1MonthSelling > 0) {
          pricingLines.push(`• 1 Month: ₹${product.price1MonthActual} → ₹${product.price1MonthSelling}`);
        }
        if (product.price3MonthActual > 0 && product.price3MonthSelling > 0) {
          pricingLines.push(`• 3 Months: ₹${product.price3MonthActual} → ₹${product.price3MonthSelling}`);
        }
        if (product.price6MonthActual > 0 && product.price6MonthSelling > 0) {
          pricingLines.push(`• 6 Months: ₹${product.price6MonthActual} → ₹${product.price6MonthSelling}`);
        }
        if (product.price12MonthActual > 0 && product.price12MonthSelling > 0) {
          pricingLines.push(`• 12 Months: ₹${product.price12MonthActual} → ₹${product.price12MonthSelling}`);
        }
        
        const summary = `
✅ Product created successfully!

📦 Product Details:
• Category: ${product.category}
• Name: ${product.name}
• Description: ${product.description}

💰 Pricing:
${pricingLines.join('\n')}

Product ID: ${product.id}
        `;

        bot.sendMessage(chatId, summary);
        sessions.delete(chatId);
      } catch (error) {
        bot.sendMessage(
          chatId,
          "❌ Error creating product. Please try again with /newpost"
        );
        sessions.delete(chatId);
      }
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("delete_")) {
      const productId = data.replace("delete_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const confirmKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Yes, Delete", callback_data: `confirm_delete_${productId}` },
              { text: "❌ Cancel", callback_data: "cancel_delete" }
            ]
          ]
        }
      };

      await bot.editMessageText(
        `⚠️ Are you sure you want to DELETE this product?\n\n📦 ${product.name}\nCategory: ${product.category}\n\n⚠️ This action cannot be undone!`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: confirmKeyboard.reply_markup
        }
      );
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("confirm_delete_")) {
      const productId = data.replace("confirm_delete_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const productName = product.name;
      
      try {
        await storage.deleteProduct(productId);
        
        await bot.editMessageText(
          `✅ Product deleted successfully!\n\n🗑️ Deleted: ${productName}`,
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        
        await bot.answerCallbackQuery(query.id, { text: "Product deleted!" });
      } catch (error) {
        await bot.answerCallbackQuery(query.id, { text: "Error deleting product" });
        bot.sendMessage(chatId, "❌ Error deleting product. Please try again.");
      }
      
      return;
    }

    if (data === "cancel_delete") {
      await bot.editMessageText(
        "❌ Deletion cancelled.",
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id, { text: "Cancelled" });
      return;
    }

    if (data.startsWith("changeimg_")) {
      const productId = data.replace("changeimg_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      sessions.set(chatId, {
        step: "changing_image",
        data: {},
        editingProductId: productId
      });

      await bot.editMessageText(
        `🖼️ Change image for: ${product.name}\n\nCurrent image: ${product.image}\n\nPlease send new image URL or photo:`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("changedesc_")) {
      const productId = data.replace("changedesc_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      sessions.set(chatId, {
        step: "changing_description",
        data: {},
        editingProductId: productId
      });

      await bot.editMessageText(
        `📝 Change description for: ${product.name}\n\nCurrent: ${product.description}\n\nPlease enter new description:`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("addopt_")) {
      const productId = data.replace("addopt_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      sessions.set(chatId, {
        step: "adding_option_to_product",
        data: {},
        editingProductId: productId
      });

      const currentOptions = product.customOptions || [];
      const optionsList = currentOptions.length > 0 
        ? currentOptions.map(opt => `• ${opt.label}: ₹${opt.actualPrice} → ₹${opt.sellingPrice}`).join('\n')
        : 'No custom options yet';

      await bot.editMessageText(
        `➕ Add option to: ${product.name}\n\nCurrent options:\n${optionsList}\n\nPlease enter new option in format:\nlabel/actualPrice/sellingPrice\n\nExample: Premium HD/649/149`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("delopt_")) {
      const productId = data.replace("delopt_", "");
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const customOptions = product.customOptions || [];
      
      if (customOptions.length === 0) {
        await bot.editMessageText(
          `❌ No custom options found for: ${product.name}\n\nUse /addoptions to add options first.`,
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        await bot.answerCallbackQuery(query.id);
        return;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: customOptions.map(option => [{
            text: `🗑️ ${option.label} (₹${option.actualPrice} → ₹${option.sellingPrice})`,
            callback_data: `deloptconfirm_${productId}_${option.id}`
          }])
        }
      };

      await bot.editMessageText(
        `🗑️ Delete option from: ${product.name}\n\nSelect an option to delete:`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: keyboard.reply_markup
        }
      );
      
      await bot.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith("deloptconfirm_")) {
      const parts = data.replace("deloptconfirm_", "").split("_");
      const productId = parts[0];
      const optionId = parts[1];
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        await bot.answerCallbackQuery(query.id, { text: "Product not found" });
        return;
      }

      const customOptions = product.customOptions || [];
      const optionToDelete = customOptions.find(opt => opt.id === optionId);
      const updatedOptions = customOptions.filter(opt => opt.id !== optionId);

      await storage.updateProduct(productId, {
        customOptions: updatedOptions
      });

      await bot.editMessageText(
        `✅ Option deleted successfully!\n\nDeleted: ${optionToDelete?.label || 'Option'}\n\nUse /showall to view the product.`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
      
      await bot.answerCallbackQuery(query.id, { text: "Option deleted!" });
      return;
    }

    if (data === "noop") {
      await bot.answerCallbackQuery(query.id);
      return;
    }

    await bot.answerCallbackQuery(query.id);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    const session = sessions.get(chatId);
    if (!session) return;

    switch (session.step) {
      case "name":
        session.data.name = text;
        session.step = "description";
        bot.sendMessage(chatId, "Please enter the product description:");
        break;

      case "description":
        session.data.description = text;
        session.step = "image";
        bot.sendMessage(
          chatId,
          "Please send the product image URL (or send a photo):"
        );
        break;

      case "image":
        session.data.image = text;
        session.step = "pricing";
        
        const addOptionsKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [{ text: "+ Add Options", callback_data: "add_options" }]
            ]
          }
        };
        
        bot.sendMessage(
          chatId,
          "Click below to add pricing options:",
          addOptionsKeyboard
        );
        break;

      case "add_pricing": {
        const parts = text.split("/");
        
        if (parts.length !== 3) {
          bot.sendMessage(
            chatId,
            "❌ Invalid format. Please use format:\nlabel/actualPrice/sellingPrice\n\nExample: Premium HD/649/149\nExample: Family Plan/999/299"
          );
          return;
        }

        const labelText = parts[0].trim();
        const actualPrice = Number(parts[1].trim());
        const sellingPrice = Number(parts[2].trim());

        if (isNaN(actualPrice) || isNaN(sellingPrice)) {
          bot.sendMessage(
            chatId,
            "❌ Invalid prices. Please enter valid numbers.\n\nExample: Premium HD/649/149"
          );
          return;
        }

        if (!session.data.customOptions) {
          session.data.customOptions = [];
        }

        const newOption = {
          id: Date.now().toString(),
          label: labelText,
          actualPrice: actualPrice,
          sellingPrice: sellingPrice,
          inStock: true
        };

        (session.data.customOptions as any[]).push(newOption);

        session.step = "pricing";
        
        const continueKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [{ text: "+ Add Options", callback_data: "add_options" }],
              [{ text: "✅ Done - Create Product", callback_data: "create_product" }]
            ]
          }
        };
        
        bot.sendMessage(
          chatId,
          `✅ Option added: ${labelText}!\n\nAdd more pricing options or click Done to create the product:`,
          continueKeyboard
        );
        break;
      }

      case "adding_option_to_product": {
        const parts = text.split("/");
        
        if (parts.length !== 3) {
          bot.sendMessage(
            chatId,
            "❌ Invalid format. Please use format:\nlabel/actualPrice/sellingPrice\n\nExample: Premium HD/649/149"
          );
          return;
        }

        const labelText = parts[0].trim();
        const actualPrice = Number(parts[1].trim());
        const sellingPrice = Number(parts[2].trim());

        if (isNaN(actualPrice) || isNaN(sellingPrice)) {
          bot.sendMessage(
            chatId,
            "❌ Invalid prices. Please enter valid numbers.\n\nExample: Premium HD/649/149"
          );
          return;
        }

        const productId = session.editingProductId;
        if (!productId) return;

        const product = await storage.getProduct(productId);
        if (!product) {
          bot.sendMessage(chatId, "❌ Product not found.");
          sessions.delete(chatId);
          return;
        }

        const existingOptions = product.customOptions || [];
        const newOption = {
          id: Date.now().toString(),
          label: labelText,
          actualPrice: actualPrice,
          sellingPrice: sellingPrice,
          inStock: true
        };

        await storage.updateProduct(productId, {
          customOptions: [...existingOptions, newOption]
        });

        bot.sendMessage(
          chatId,
          `✅ Option added successfully!\n\n${labelText}: ₹${actualPrice} → ₹${sellingPrice}\n\nUse /showall to view the product.`
        );
        
        sessions.delete(chatId);
        break;
      }

      case "changing_image": {
        const productId = session.editingProductId;
        if (!productId) return;

        await storage.updateProduct(productId, { image: text });
        
        bot.sendMessage(
          chatId,
          `✅ Image updated successfully!\n\nNew image URL: ${text}\n\nUse /showall to view the product.`
        );
        
        sessions.delete(chatId);
        break;
      }

      case "changing_description": {
        const productId = session.editingProductId;
        if (!productId) return;

        await storage.updateProduct(productId, { description: text });
        
        bot.sendMessage(
          chatId,
          `✅ Description updated successfully!\n\nNew description: ${text}\n\nUse /showall to view the product.`
        );
        
        sessions.delete(chatId);
        break;
      }

      case "editing_custom_option": {
        const productId = session.editingProductId;
        const optionId = session.editingOptionId;
        
        if (!productId || !optionId) return;

        const parts = text.split("/");
        
        if (parts.length !== 2) {
          bot.sendMessage(
            chatId,
            "❌ Invalid format. Please use format:\nactualPrice/sellingPrice\n\nExample: 649/149"
          );
          return;
        }

        const actualPrice = Number(parts[0].trim());
        const sellingPrice = Number(parts[1].trim());

        if (isNaN(actualPrice) || isNaN(sellingPrice)) {
          bot.sendMessage(
            chatId,
            "❌ Invalid prices. Please enter valid numbers.\n\nExample: 649/149"
          );
          return;
        }

        const product = await storage.getProduct(productId);
        if (!product) {
          bot.sendMessage(chatId, "❌ Product not found.");
          sessions.delete(chatId);
          return;
        }

        const customOptions = product.customOptions || [];
        const updatedCustomOptions = customOptions.map(option => {
          if (option.id === optionId) {
            return { ...option, actualPrice, sellingPrice };
          }
          return option;
        });

        await storage.updateProduct(productId, { customOptions: updatedCustomOptions });
        
        const updatedOption = updatedCustomOptions.find(opt => opt.id === optionId);
        
        bot.sendMessage(
          chatId,
          `✅ Pricing updated successfully for "${updatedOption?.label}"!\n\n₹${actualPrice} → ₹${sellingPrice}\n\nUse /showall to view the product.`
        );
        
        sessions.delete(chatId);
        break;
      }

      default:
        if (session.step.startsWith("editing_")) {
          const duration = session.currentDuration;
          const productId = session.editingProductId;
          
          if (!duration || !productId) return;

          const expectedDur = duration.replace("_", " ");
          const editParts = text.split("_");
          
          if (editParts.length !== 3) {
            bot.sendMessage(
              chatId,
              `Invalid format. Please use format:\n${expectedDur}_actualPrice_sellingPrice\n\nExample: ${expectedDur}_649_149`
            );
            return;
          }

          const editDurationPart = editParts[0].toLowerCase().trim();
          const editActualPrice = Number(editParts[1]);
          const editSellingPrice = Number(editParts[2]);
          
          const expectedEditLower = expectedDur.toLowerCase().trim();
          const normalizedEditInput = editDurationPart.replace(/\s+/g, " ");
          const normalizedEditExpected = expectedEditLower.replace(/\s+/g, " ");
          
          if (normalizedEditInput !== normalizedEditExpected) {
            bot.sendMessage(
              chatId,
              `Please enter pricing for ${expectedDur}.\nFormat: ${expectedDur}_actualPrice_sellingPrice\n\nExample: ${expectedDur}_649_149`
            );
            return;
          }

          if (isNaN(editActualPrice) || isNaN(editSellingPrice)) {
            bot.sendMessage(
              chatId,
              `Invalid prices. Please use format:\n${expectedDur}_actualPrice_sellingPrice\n\nExample: ${expectedDur}_649_149`
            );
            return;
          }

          let updateData: Partial<InsertProduct> = {};
          
          if (duration === "1_month") {
            updateData.price1MonthActual = editActualPrice;
            updateData.price1MonthSelling = editSellingPrice;
          } else if (duration === "3_months") {
            updateData.price3MonthActual = editActualPrice;
            updateData.price3MonthSelling = editSellingPrice;
          } else if (duration === "6_months") {
            updateData.price6MonthActual = editActualPrice;
            updateData.price6MonthSelling = editSellingPrice;
          } else if (duration === "12_months") {
            updateData.price12MonthActual = editActualPrice;
            updateData.price12MonthSelling = editSellingPrice;
          }

          await storage.updateProduct(productId, updateData);
          
          bot.sendMessage(
            chatId,
            `✅ Pricing updated successfully for ${duration.replace("_", " ")}!\n\nUse /showall to view all products.`
          );
          
          sessions.delete(chatId);
        }
        break;
    }
  });

  bot.on("photo", async (msg) => {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    if (!session) return;

    const photo = msg.photo?.[msg.photo.length - 1];
    if (!photo) return;

    const fileId = photo.file_id;
    const file = await bot.getFile(fileId);
    const imageUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    if (session.step === "image") {
      session.data.image = imageUrl;
      session.step = "pricing";
      
      const addOptionsKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "+ Add Options", callback_data: "add_options" }]
          ]
        }
      };
      
      bot.sendMessage(
        chatId,
        "Click below to add pricing options:",
        addOptionsKeyboard
      );
    } else if (session.step === "changing_image") {
      const productId = session.editingProductId;
      if (!productId) return;

      await storage.updateProduct(productId, { image: imageUrl });
      
      bot.sendMessage(
        chatId,
        `✅ Image updated successfully!\n\nNew image uploaded.\n\nUse /showall to view the product.`
      );
      
      sessions.delete(chatId);
    }
  });

  console.log("Telegram bot initialized successfully!");
  return bot;
}
