const { MessageEmbed } = require('discord.js')

const run = (client, queue, song) => {
        queue.textChannel.send({embeds: [new MessageEmbed()
            .setColor('BLUE')
            .setTitle(client.emotes.success + ' ' + song.name)
            .setThumbnail(song.thumbnail)
            .addFields(
              {name: 'Views', value: '' + song.views, inline: true},
              {name: 'Likes', value: '' + song.likes, inline: true},
              {name: 'Duração', value: '' + song.formattedDuration, inline: true},
              {name: 'Publicado por', value: song.uploader.name},
              {name: 'Status', value: '' + client.uteis.status(queue)},
            )
          ]})
}

module.exports = {run}