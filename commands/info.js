const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setDescription("Bot info")
        .setColor("#00e600")
        .setThumbnail(bicon)
        .addField("Bot name", bot.user.username)
        .addField("Created", "Mon Aug 26 2019 13:22:12 (GMT+0200)")
        .addField("List of all commands", "!command")
        return message.channel.send(botembed);
}

module.exports.help = {
    name: "info"
}