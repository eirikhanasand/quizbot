const Discord = require("discord.js");
const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json");

module.exports.run = async (bot, message, args) => {
    let cmdembed = new Discord.RichEmbed()
    .setDescription("List of all commands.")
    .addBlankField()
    .setColor("#00e600")
    .addField("prefix", `${botconfig.prefix}`)
    .addField("info", "Info About The Bot")
    .addField("say", "Makes The bot say anything you want.")
    .addField("start", "Starts The Quiz.")
    .addField("stop", "Stops The Quiz.")
    return message.channel.send(cmdembed);    
}

module.exports.help = {
    name: "command"
}