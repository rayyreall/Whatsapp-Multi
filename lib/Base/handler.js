const { EventHandler } = require("./parseEvent")
const { format } = require("util")

class createEvents {
	constructor() {
	}
	getEvents = (events, client) => {
		events.on("chat-update", (chats) => events.emit("create-chats", new EventHandler().getRespon(chats, client)))
	}
	runScript = (events, client) => {
		events.on("create-chats", (message) => {
			if (!message) return
			const { from, isOwner, command, args, id } = message;
			console.log(message)
		})
	}
}
module.exports.createEvents = createEvents