const { MessageEmbed } = require('discord.js')

const run = (client, queue, playlist) => {
        queue.textChannel.send({embeds: [new MessageEmbed()
            .setColor('BLUE')
            .setImage(playlist.thumbnail)
            .setTitle('Playlist adicionada: ' + playlist.name)
            .addFields(
              {name: 'Duração', value: '' + playlist.formattedDuration},
              {name: 'Quantidade', value: '' + playlist.songs.length + (playlist.songs.length > 1 ? ' músicas' : ' música')},
            )
          ]})
}

module.exports = {run}