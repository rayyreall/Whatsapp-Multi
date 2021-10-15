const { EventEmitter } = require("events")

class createEvents extends EventEmitter {
	constructor(client) {
		super()
		client.sock?.ev?.on("messages.upsert", async message => {
			console.log(JSON.stringify(message, undefined, 2))
			this.emit("chat-update", message)
		})
		client.sock?.ev?.on("")
	}
}
module.exports.createEvents = createEvents