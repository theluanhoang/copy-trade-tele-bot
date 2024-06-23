const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

// Thay thế token dưới đây bằng token của bot nhận được từ @BotFather
const token = '7293886054:AAESRgtGSpHbhhjYwnitkpkkOVj75lXkhcs';

// ID của nhóm A (nhóm nguồn)
const GROUP_A_ID = '-1002225850921';

// ID của nhóm B (nhóm đích)
const GROUP_B_ID = '-1002159566248';

// Khởi tạo bot với token
const bot = new Telegraf(token);

// Middleware để xử lý tin nhắn văn bản từ nhóm A
bot.on('message', async (ctx) => {
    // Lấy thông tin tin nhắn
    const message = ctx.message;

    // Kiểm tra xem tin nhắn có từ nhóm A không
    if (message.chat.id.toString() === GROUP_A_ID) {
        // Lấy nội dung tin nhắn và thông tin người gửi
        const userMessage = message.text || '';
        const userName = message.from.username || message.from.first_name || 'Unknown';

        // Tạo nội dung tin nhắn cần gửi đến nhóm B
        const forwardMessage = `Message from ${userName}: ${userMessage}`;

        try {
            // Gửi tin nhắn đến nhóm B
            await ctx.telegram.sendMessage(GROUP_B_ID, forwardMessage);
            console.log('Message forwarded to group B');
        } catch (error) {
            console.error('Error forwarding message to group B:', error);
        }
    }
});

// Khởi động bot để lắng nghe các sự kiện
bot.launch().then(() => {
    console.log('Bot is running...');
}).catch((err) => {
    console.error('Bot launch error:', err);
});
