const { MessageEmbed } = require('discord.js')

const run = (client, message, results) => {
    message.channel.send(`**Resultados**\n${
        results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
    }\n*Insira um número ou espere 1 minuto para cancelar*`);
}

module.exports = {run}