const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server info")
    .setColor("#00e600")
    .setThumbnail(sicon)
    .addField("Server name", message.guild.name)
    .addField("Created", message.guild.createdAt)
    .addField("List of all commands", "!command")
    .addField("You Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memberCount)

    message.channel.send(serverembed);

}

module.exports.help = {
    name: "serverinfo"
}