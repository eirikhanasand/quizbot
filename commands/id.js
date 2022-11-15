const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let idembed = new Discord.RichEmbed()
    //message.channel.send(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}`) 
    .setColor("#00e600")
    .addField(`Your Username:`, `${message.author.username}`)
    .addField(`Your ID:`, `${message.author.id}`)

    return message.channel.send(idembed);
}

module.exports.help = {
    name: "id"
}