const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 🔧 CONFIGURATION FÜR VERSCHIEDENE SERVER & CHANNELS 🔧
const SERVER_CONFIG = {
    // Füge hier deine Channel-IDs ein
    '1434301880841801788': {
        name: 'Lager Server 1',
        delay: 3000
    }
    // Weitere Channels können hier hinzugefügt werden
};

client.once('ready', () => {
    console.log(`✅ Bot ist online als ${client.user.tag}!`);
    console.log(`📺 Überwache ${Object.keys(SERVER_CONFIG).length} Channels:`);
    Object.entries(SERVER_CONFIG).forEach(([channelId, config]) => {
        console.log(`   - ${config.name} (${channelId})`);
    });
});

client.on('messageCreate', async (message) => {
    const channelConfig = SERVER_CONFIG[message.channel.id];
    if (!channelConfig) return;
    if (message.author.bot && !message.webhookId) return;

    console.log(`🆕 Neue Nachricht in ${channelConfig.name}`);

    setTimeout(async () => {
        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });
            const latestMessage = messages.first();
            const messagesToDelete = messages.filter(msg => msg.id !== latestMessage.id);
            
            if (messagesToDelete.size > 0) {
                await message.channel.bulkDelete(messagesToDelete);
                console.log(`🗑️ ${messagesToDelete.size} Nachrichten gelöscht`);
            }
        } catch (error) {
            console.error('❌ Fehler:', error);
        }
    }, channelConfig.delay);
});

// Bot Token aus Environment Variables
client.login(process.env.BOT_TOKEN);
