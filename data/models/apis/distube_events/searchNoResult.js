const { MessageEmbed } = require('discord.js')

const run = (client, message, query) => {
    message.channel.send(`Sem resultados para \`${query}\`!`)
}

module.exports = {run}