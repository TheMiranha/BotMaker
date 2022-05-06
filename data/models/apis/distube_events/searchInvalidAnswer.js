const { MessageEmbed } = require('discord.js')

const run = (client, message) => {
    message.channel.send('Número inválido!')
}

module.exports = {run}