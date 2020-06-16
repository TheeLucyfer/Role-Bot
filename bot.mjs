import Discord from 'discord.js'
import fs from 'fs'
import util from 'util'
import { devRoles as rolesList } from './roles.mjs'

// const reactEmoji = "722248806732660796"
const reactEmoji = "722166920324972659"
const client = new Discord.Client({
	partials: ["MESSAGE", "REACTION"]
});
//Promisifies reading and writing to the files
const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

let config;
let messageID;

//Displays a message in the terminal once the bot is online/ready
client.once('ready', async () => {
	console.log('Ready!');
	try {
		let messageIDBuffer = await readFilePromise("messageID.txt")
		messageID = messageIDBuffer.toString();
		console.log('Found old message', messageID)
	} catch (err) {

	}
});

//Logs in to the bot using the config token
fs.readFile('config.json', (err, data) => {
	config = JSON.parse(data);
	client.login(config.token);
});


let messageContent = "React below for the Competitive role. You'll gain access to the Competitive LFG channels pertaining to your region role!"

client.on('message', async (message) => {
	if (message.member.id != "262852578465808386" && message.member.id != "165001528900452353") {
		return;
	}

	if (message.content === '!post') {
		var botMessage = await message.channel.send(messageContent);
		messageID = botMessage.id;

		try {
			await writeFilePromise("messageID.txt", botMessage.id)
		} catch (err) {
			if (err)
				throw err;
		}

		botMessage.react(reactEmoji)
	}

	if (message.content.startsWith("!config ")){
		messageContent = message.content.substr(7)
	}
});

client.on("messageReactionAdd", async (messageReaction, user) => {
	if (messageReaction.message.id != messageID) {
		return;
	}

	if (messageReaction.emoji.id != reactEmoji) {
		messageReaction.remove()

		if (messageReaction.emoji.toString() != '🤦‍♀️')
			messageReaction.message.react("🤦‍♀️")

		return
	}


	if (user === client.user) return

	const guild = messageReaction.message.guild;
	const member = await guild.members.fetch(user.id);

	console.log("Checking user for roles in rolesList HEHEHE")

	for (let location in rolesList) {
		console.log(`Checking if user has ${location}`);

		const role = rolesList[location];
		if (member._roles.includes(role.id)) {
			member.roles.add(role.comp)
			return;
		}
	}
})

client.on("messageReactionRemove", async (messageReaction, user) => {
	if (messageReaction.message.id != messageID) {
		return;
	}
	if (user === client.user) return
	const guild = messageReaction.message.guild;
	const member = await guild.members.fetch(user.id);
	let roleValues = Object.values(rolesList)
	let compRoleIDs = roleValues.map(removeRole => removeRole.comp)
	member.roles.remove(compRoleIDs)
})