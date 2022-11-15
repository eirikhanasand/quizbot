/*
MAIN BOT DOCUMENT
*/
const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json")
const Discord = require("discord.js");
const quiz = require("/Users/eirikhanasand/Desktop/personal/quizbot/quiz.json");
const assert = require('assert');
const url = botconfig.mongourl;
const MongoClient = require('mongodb').MongoClient;

module.exports.run = async (bot, message, args) => {

//  CONNECT TO MONGODB DATABASE
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
        assert.equal(null, err);
        console.log("MongoDB successfully connected.");
        const db = client.db("QuizData");
        const dbc = db.collection("Points");
        const fstopid = {"id" : "stopid"};
        const fstopfind = await dbc.findOne(fstopid);
        const ari = dbc.find( { thisround: { $gt: 0 }})

//      THIS IF ELSE CHAIN IS FOR RESETTING THE UNANSWERED COUNTER EACH TIME THE COMMAND IS CALLED.
        if(fstopfind) {
            dbc.updateOne(
                {"id" : "stopid"},
                { $set: { "recentActivity" : "Updated", "unanswered" : 0} }
            )
        } else {
            dbc.insertOne({
                "id": "stopid",
                quiz: "Score",
                recentActivity: "Created",
                unanswered: 0
        })
        }

        if(fstopfind) {
            dbc.updateOne(
                {"id" : "stopid"},
                { $set: { "recentActivity" : "Updated", "unanswered" : 0} }
            )
        } else {
            dbc.insertOne({
                "id": "stopid",
                quiz: "Score",
                recentActivity: "Created",
                unanswered: 0
        })
        }

        let LEembed = new Discord.RichEmbed()
        .setDescription(`Quizzen ble automatisk stoppet etter 10 spørsmål.\nHer er oversikten over spillet.`)
        .setColor("#F72C00")
        .setFooter("Skriv !quiz for å starte en ny quiz.") 
        
        let UEembed = new Discord.RichEmbed()
        .setDescription(`Quizzen ble automatisk stoppet siden ingen har svart på de to siste spørsmålene.\nHer er oversikten over spillet.`)
        .setColor("#F72C00")
        .setFooter("Skriv !quiz for å starte en ny quiz.") 
        
//      QUESTION LOOP
        for (let i = 1; i < 11; i++) {
            const stopid = {"id" : "stopid"};
            const stopfind = await dbc.findOne(stopid);
            console.log(`Unanswered: ${stopfind.unanswered}`)

/*          IF AT LEAST ONE OF THE LAST TWO QUESTIONS HAVE RECIEVED ONE OR MORE ANSWERS, EXECUTE THE IF STATEMENT. 
            OTHERWISE, EXECUTE THE ELSE STATEMENT. */ 
            if (await stopfind.unanswered < 2) {
                const authid = {"id" : message.author.id}
                const authfind = await dbc.findOne(authid);
                const item = quiz[Math.floor(Math.random()*quiz.length)];

                const rfilter = response => {
                return item.answers.some(answers => answers.toLowerCase() === response.content.toLowerCase());
                };

                const wfilter = response => {
                return item.alternatives.some(alternatives => alternatives.toLowerCase() === response.content.toLowerCase());
                };

                let qembed1 = new Discord.RichEmbed()
                    .setDescription(/*`*Kategorier* \n \n */`**${item.question}** \n **A:** ${item.alt1} \n **B:** ${item.alt2} \n **C:** ${item.alt3} \n **D:** ${item.alt4} \n \n Skriv en bokstav, eller hele svaret! \n Svaret vil bli avslørt om 15 sekunder.`)
                    .setColor("#3B98FA");
                await message.channel.send(qembed1);

                const [rcoll, wcoll] = await Promise.all([
                    message.channel.awaitMessages(rfilter, { max: 1, time: 5000 }),
                    message.channel.awaitMessages(wfilter, {time: 5000 })
                  ]);

                console.log(`Collected: ${wcoll.first()}`);
                console.log(`Collected: ${rcoll.first()}`);
  
                //const firstwcoll = (wcoll.first() && wcoll.first().author);
                const firstrcoll = (rcoll.first() && rcoll.first().author);

                
//              CREATING A DOCUMENT FOR THE !QUIZ MESSAGE AUTHOR TO KEEP TRACK OF THEIR STATISTICS ON THE BOT
                if(authfind) {
                    dbc.updateOne(
                        {"id" : message.author.id},
                        { $set: { "recentActivity" : "Updated" }}
                        )
                } else {
                    dbc.insertOne({
                        "name": message.author.username,
                        "id": message.author.id,
                        quiz: "Score",
                        recentActivity: "Created",
                        entries: 0, 
                        correct: 0,
                        wrong: 0,
                        points: 0,
                        streak: 0,
                        longest: 0,
                        tags: ["score"]
                    });
                };

//              IF NO ANSWERS WERE COLLECTED THIS WILL BE FOUND TRUE, AND THE UNANSWERED COUNTER WILL BE INCREASED BY ONE.
                if(rcoll.size === 0 && wcoll.size === 0) {
                    let NAembed = new Discord.RichEmbed()
                        .setDescription(`Ingen svar funnet, skriv **A**, **B**, **C** eller **D** for å svare`)
                        .setColor("#f4ff4c")
                        .setFooter("Riktig svar vises kun når du har gjettet.")
                        
                    message.channel.send(NAembed);

//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) EXISTS INCREASE THE UNANSWERED COUNTER BY ONE.
                    if(stopfind) {
                        dbc.updateOne(
                            {"id" : "stopid"},
                            { $set: { "recentActivity" : "Updated"  }, $inc: { "unanswered" : 1} }
                        )
//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) COUNTER EQUALS 1, INCREASE THE UNANSWERED COUNTER BY ONE.
                    } else if (stopfind = 1){
                        dbc.updateOne(
                            {"id" : "stopid"},
                            { $set: { "recentActivity" : "Updated"  }, $inc: { "unanswered" : 1} }
                        )
//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) DOES NOT EXIST, THEN CREATE IT AND SET THE UNANSWERED COUNTER TO ONE.
                    } else {
                        dbc.insertOne({
                            "id": "stopid",
                            quiz: "Score",
                            recentActivity: "Created",
                            unanswered: 1
                    })
                    }

//              IF SOMEONE ANSWERED A QUESTION SET STOPFIND (THE UNANSWERED TRACKING DOCUMENT) TO 0.
                } else {
                    if (stopfind) {
                        dbc.updateOne(
                        {"id" : "stopid"},
                        { $set: { "recentActivity" : "Updated", "unanswered" : 0} }
                        )   
                    }

                    if (rcoll.size > 0) {
                        const rcollid = {"id" : rcoll.first().author.id};
                    
                    if (rcollid) {
                        const rcollfind = await dbc.findOne(rcollid);

                        if (firstrcoll && rcollfind){
                            dbc.updateOne(
                                {"id" : rcoll.first().author.id},
                                { $set: { "recentActivity" : "Updated"  }, $inc: { "entries" : 1, "correct" : 1, "points" : 10, "streak" : 1, "longest" : 1, "thisround":1 } }
                            )
    
                            let Aembed = new Discord.RichEmbed()
                                .setDescription(`${rcoll.first().author} riktig! ${item.answer}`)
                                .setColor("#00e600")
                                .setFooter(`La til 10 poeng. Du har totalt ${rcollfind.points + 10} poeng`)
                            message.channel.send(Aembed);
    
    /*                  IF THE FIRST PERSON TO ANSWER CORRECTLY DOES NOT HAVE A DOCUMENT, CREATE IT, AND SET THE ENTRIES AND CORRECT COUNTERS 
                        TO 1, AND THE SCORE COUNTER TO 10*/                
                        } else {//(firstrcoll){
                            dbc.insertOne({
                                "name": rcoll.first().author.username,
                                "id": rcoll.first().author.id,
                                quiz: "Score",
                                recentActivity: "Created",
                                entries: 1, 
                                correct: 1,
                                wrong: 0,
                                points: 10,
                                streak: 1,
                                longest: 1,
                                thisround: 1,
                                tags: ["score"],
                            })
    
                            let Aembed = new Discord.RichEmbed()
                                .setDescription(`${rcoll.first().author} riktig! ${item.answer}`)
                                .setColor("#00e600")
                                .setFooter(`La til 10 poeng. Du har totalt 10 poeng`);
                            message.channel.send(Aembed);
                        
    /*                  IF NO ONE ANSWERS CORRECTLY, BUT THE PERSON(S) WHO ANSWERED WRONG ALREADY HAS/HAVE A DOCUMENT, 
                        INCREASE THE ENTRIES AND WRONG COUNTERS BY 1*/                  
                        } 
                    }
                    } else {
                        const wcollid = {"id" : wcoll.first().author.id};
                    
                    if (wcollid) {
                        const wcollfind = await dbc.findOne(wcollid);
                    
                                        
/*                  IF THE FIRST PERSON TO ANSWER CORRECTLY ALREADY HAS A DOCUMENT, INCREASE THE ENTRIES AND CORRECT COUNTERS BY 1, 
                    AND THE POINTS COUNTER BY 10*/                  
                    if (wcollfind) {
                        dbc.updateOne(
                            {"id" : wcoll.first().author.id},
                            { $set: { "recentActivity" : "Updated", "streak" : 0 }, $inc: { "entries" : 1, "wrong" : 1 } }
                        )

                        let Fembed = new Discord.RichEmbed()
                            .setDescription(`Ingen hadde riktig. ${item.answer}`)
                            .setColor("#F72C00");
                            
                        message.channel.send(Fembed);

/*                  IF NO ONE ANSWERS CORRECTLY, AND THE PERSON(S) WHO ANSWERED WRONG DOES HAVE A DOCUMENT, 
                    CREATE IT AND SET THE WRONG AND THE ENTRIES COUNTER TO 1*/                  
                    } else {
                        dbc.insertOne({
                            "name": {"id" : wcoll.first().author.id}.username,
                            "id": {"id" : wcoll.first().author.id},
                            quiz: "Score",
                            recentActivity: "Created",
                            entries: 1, 
                            correct: 0,
                            wrong: 1,
                            points: 0,
                            streak: 0,
                            longest: 0,
                            thisround: 0,
                            tags: ["score"],
                        })

                        let Fembed = new Discord.RichEmbed()
                            .setDescription(`Ingen hadde riktig. ${item.answer}`)
                            .setColor("#F72C00");                        
                        message.channel.send(Fembed);
                }}
            }
                console.log('Run ' + i)
                await new Promise(r => setTimeout(r, 1000));
            };

//          IF THE LAST TWO QUESTIONS HAVE NOT BEEN ANSWERED, SAY THIS IN THE CHANNEL WHERE IT WAS USED, THEN STOP THE LOOP.
            } else {
                let Sembed = new Discord.RichEmbed()
                        .setDescription(`Quizzen ble automatisk stoppet siden ingen har svart på de to siste spørsmålene.`)
                        .setColor("#F72C00")
                        .setFooter("Skriv !quiz for å starte en ny quiz.")                        
                    message.channel.send(Sembed);

                    await ari.each(async (err, doc) => {
                        const arid = await doc
                          if (err) {console.log(err)}
                          else {
                            console.log(doc)
                            
                            if (arid < 1) {
                              return;
                            } else {
                              const ard = await arid;
                              UEembed.addField(`${await ard.name}`, `${await ard.thisround * 10} Poeng`)
                            }
                            
                          }
                      },
                      setTimeout(()=>message.channel.send(UEembed),50))
                    dbc.updateOne(
                        {"thisround" : { $gt: 0}},
                        { $set: { "recentActivity" : "Updated"  }, $set: { "thisround":0 } }
                      )

                return;
            }
        }

        await ari.each(async (err, doc) => {
            const arid = await doc
              if (err) {console.log(err)}
              else {
                console.log(doc)
                
                if (ari < 1) {
                  return;
                } else {
                  const ard = await arid;
                  LEembed.addField(`${await ard.name}`, `${await ard.thisround * 10} Poeng`)
                }
                
              }
        }, setTimeout(()=>message.channel.send(LEembed),75))
        
        dbc.updateOne(
            {ari},
            { $set: { "recentActivity" : "Updated"  }, $set: { "thisround":0 } }
        )
        
    }
    )
    console.log('Ended Quiz.');
    };

/*
FOR THE COMMAND HANDLER, THE NAME VARIABLE IS THE !NAME USED TO CALL AND EXECUTE THE FILE FROM DISCORD. 
IN THIS CASE IT WOULD BE !quiz. 
*/ 
module.exports.help = {
    name: "fastquiz"
}