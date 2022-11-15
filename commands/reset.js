const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = botconfig.mongourl;
MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
    assert.equal(null, err);
    console.log("MongoDB successfully connected.")
    const db = client.db("QuizData");
    db.collection('Points').updateOne(
        { quiz: "Score" },
        { $set: { 
            recentActivity: "Reset",
            entries: 0,
            correct: 0,
            wrong: 0,
            points: 0,
        },
          $currentDate: { lastModified: true } })
      .then(function(result) {
        let Fembed = new Discord.RichEmbed()
                .setDescription(`Reset all values for player ${message.author}\n Player ID: ${message.author.id}`)
                .setColor("#F72C00");
                

        message.channel.send(Fembed)
        console.log(`Reset all values for player ${message.author.id}`)
      })
    //var cursor = db.collection('Points').find({});
    //function iterateFunc(doc) {
    //    console.log(JSON.stringify(doc, null, 4));
    // }
     
    // function errorFunc(error) {
    //    console.log(error);
    // }
     
    // cursor.forEach(iterateFunc, errorFunc);
    await new Promise(r => setTimeout(r, 100));
    client.close(console.log("Closed MongoDB"));
  });
}

module.exports.help = {
    name: "reset"
}