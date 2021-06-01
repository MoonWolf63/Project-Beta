const Discord = require("discord.js");
const fs = require('fs');
require('events').EventEmitter.defaultMaxListeners = 300;
const client = new Discord.Client();
const mysql = require('mysql');
const settings = require('./config.json');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'projectbeta'
});

//Make sure you put your MYSQL data in or it the bot wont work
client.on("ready", () => {
  console.log("I am ready!");
});
connection.connect(function(err, result) {
	console.log("MySQL System Online!");
});

client.on('message', message => {
	if (message.content === '!createticket') {
	  let b = connection.query("SELECT * FROM tickets WHERE userid = ?;", message.author.id, function (err, result, fields){
      if (Object.keys(result).length === 0) {
message.channel.send("Ticket Created!");
console.log(message.author.username);

message.guild.channels.create(message.author.username, "text")
.then(m => {
m.overwritePermissions(
[
{
	id: message.guild.roles.everyone,
	deny: ['VIEW_CHANNEL'],
},
{
	id: message.author.id,
	allow: ['VIEW_CHANNEL'],
},
],
);
m.send("Our staff will get to you when we can, please be patient! To close the ticket please type !closeticket");
let ticketcreate ="INSERT INTO tickets (username, channelid, userid) VALUES ('" + message.author.username + "', '" + m.id + "','" + message.author.id + "');";
console.log(ticketcreate);
connection.query(ticketcreate)
})
console.log("Created!");

} else {
message.channel.send("I'm sorry, a ticket with your account has already been registered! If you believe this is an error please let the staff know!");
}
});
  }
});

client.on('message', message => {
	if (message.content === '!closeticket') {
	  let b = connection.query("SELECT * FROM tickets WHERE channelid = ?;", message.channel.id, function (err, result, fields){
      if (Object.keys(result).length === 0) {
message.channel.send("I'm sorry, you do not have an open ticket.");
      } else {
let delchan = message.guild.channels.cache.get(message.channel.id);
delchan.delete();
let ticketdel ="DELETE FROM tickets where channelid = " + message.channel.id + ";";
connection.query(ticketdel)

        
      }
    })
  }
});






client.login(settings.token);
