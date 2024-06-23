// const TelegramBot = require('node-telegram-bot-api');
// const { MessageHandler, Filters } = require('node-telegram-bot-api');
const {Telegraf} = require('telegraf')
const {message} = require('telegraf/filters')
// replace the value below with the Telegram token you receive from @BotFather
const token = '7293886054:AAESRgtGSpHbhhjYwnitkpkkOVj75lXkhcs';

// const bot = new TelegramBot(token);

// Thay thế GROUP_A_ID bằng ID của nhóm A (nhóm nguồn)
const GROUP_A_ID = '-1002225850921';

// Thay thế GROUP_B_ID bằng ID của nhóm B (nhóm đích)
const GROUP_B_ID = '-1002159566248';


const bot = new Telegraf(token)

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  await ctx.leaveChat()
})

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`)
})

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

  // Using context shortcut
  await ctx.answerCbQuery()
})

bot.on('inline_query', async (ctx) => {
  const result = []
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

  // Using context shortcut
  await ctx.answerInlineQuery(result)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// bot.onText('message', (msg) => {
//   console.log('Received message:', msg);

//   // Kiểm tra nếu tin nhắn đến từ nhóm A
//   if (msg.chat.id.toString() === GROUP_A_ID) {
//     const userMessage = msg.text || '';
//     const userName = msg.from.username || msg.from.first_name || 'Someone';
//     const forwardMessage = `Message from ${userName}: ${userMessage}`;

//     // Gửi tin nhắn tới nhóm B
//     bot.sendMessage(GROUP_B_ID, forwardMessage)
//       .then(() => {
//         console.log('Message forwarded to group B');
//       })
//       .catch((error) => {
//         console.error('Error sending message to group B:', error);
//       });
//   }
// });

// bot.startPolling();

// console.log('Bot is running...');