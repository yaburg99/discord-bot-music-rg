const {SlashCommandBuilder} = require("@discordjs/builders");
const{EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Bỏ qua bài nhạc"),
    execute: async({client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("Không có bài nhạc nào đang chạy");
            return;
        }
        const currentSong = queue.current;
        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(` Đã bỏ qua **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}