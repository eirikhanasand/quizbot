const Discord = require("discord.js");
const quiz = require("/Users/eirikhanasand/Desktop/personal/quizbot/quiz.json");

module.exports.run = async (bot, message, args) => {

        for (let r = 1; r < 51; r++) {
                const item = quiz[Math.floor(Math.random()*quiz.length)];

                const rfilter = response => {
                return item.answers.some(answers => answers.toLowerCase() === response.content.toLowerCase());
                };

                const wfilter = response => {
                return item.alternatives.some(alternatives => alternatives.toLowerCase() === response.content.toLowerCase());
                };

                let qembed1 = new Discord.RichEmbed()
                    .setDescription(`*Categories* \n \n **${item.question}** \n **A:** ${item.alt1} \n **B:** ${item.alt2} \n **C:** ${item.alt3} \n **D:** ${item.alt4} \n \n Write a letter, or the full answer! \n The answer will be revealed in 15 seconds.`)
                    .setColor("#3B98FA");
                await message.channel.send(qembed1);

                const [rcoll, wcoll] = await Promise.all([
                    message.channel.awaitMessages(rfilter, { max: 1, time: 15000 }),
                    message.channel.awaitMessages(wfilter, {time: 15000 })
                  ]);
                

                console.log(`collected: ${wcoll.first()}`);
                console.log(`collected: ${rcoll.first()}`);

                const firstwcoll = (wcoll.first() && wcoll.first().author);
                const firstrcoll = (rcoll.first() && rcoll.first().author);

                if(rcoll.size === 0 && wcoll.size === 0) {
                    let NArembed = new Discord.RichEmbed()
                        .setDescription(`${rcoll.size} answers found in rcoll and ${wcoll.size} answers found in wcoll, write **A**, **B**, **C** eller **D** to answer!`)
                        .setColor("#f4ff4c")
                        .setFooter("The correct answer will only be shown if you guess.")
                        
                    message.channel.send(NArembed);
                    
                } else if (firstwcoll) {
                    let Wembed = new Discord.RichEmbed()
                        .setDescription(`${wcoll.first().author} wrong in (firstwcoll)! ${item.answer}`)
                        .setColor("#F72C00")
                    message.channel.send(Wembed);

                } else if (firstrcoll) {
                    let Aembed = new Discord.RichEmbed()
                        .setDescription(`${rcoll.first().author} correct in (firstrcoll)! ${item.answer}`)
                        .setColor("#00e600")
                    message.channel.send(Aembed);

                } else {
                    let AWembed = new Discord.RichEmbed()
                        .setDescription(`Everyone was wrong! ${item.answer}`)
                        .setColor("#00e600")
                    message.channel.send(AWembed);   

                }              

                console.log('Run ' + r)
            }
            }
module.exports.help = {
    name: "c"
}