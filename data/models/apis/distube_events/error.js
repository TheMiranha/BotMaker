const { MessageEmbed } = require('discord.js')

const run = (client, channel, e) => {
            channel.send(`Ocorreu um erro, chama o miranha: ${e.toString().slice(0, 1974)}`)
            console.error(e)
}

module.exports = {run}