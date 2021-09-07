const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '1923844013:AAEelvggK8VVzG7cgp-dE2-6a_u2lYjRKh8'

const bot = new TelegramApi(token, {polling: true})

const chats = {}
// stickers pack https://tlgrm.ru/stickers/pappy_fox

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о авторе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/1.webp')
            await bot.sendMessage(chatId, `Привет ${msg.from.first_name} ${msg.from.last_name}!`);
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Ualikhanov University`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Автор COOPWORK Ruslan Svetlichnyy`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/18.webp')
        return bot.sendMessage(chatId, 'Не могу ничего найти по такому запросу, попробуй ещё');

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start()