const {SlashCommandBuilder} = require("@discordjs/builders");
const{ EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Yabu -10 bài nhạc đầu tiên trong hàng chờ"),
    execute : async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue || !queue.playing) {
            await interaction.reply("Không bài nhạc nào đang nghe");
            return;
        }
        const queueString =queue.tracks.slice(0,10).map((song,i)=>{
            return `${i+1})  [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Các bài hát đang nghe:**\n\` ${currentSong.title}-<@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}