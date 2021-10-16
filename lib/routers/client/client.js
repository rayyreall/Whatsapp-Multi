const { default: MakeWASocket, BufferJSON, initInMemoryKeyStore,  DisconnectReason, AnyMessageContent,  delay  } = require('@adiwajshing/baileys-md')
const fs = require("fs");
const pino = require("pino")
const axios = require("axios")
const { EventEmitter } = require("events")
const { createEvents } = require("../../Base/handler")

let sock = undefined;

module.exports.createConnection = class createConnection extends EventEmitter{
	accounts = undefined;
	constructor(account) {
		super()
		this.accounts = account || "./lib/routers/account/sessions_default.json";
		try {
			const startSocket = () => {
				const sock = MakeWASocket({
					logger: pino({ level: 'fatal' }),
					auth: this.loadAuth(),
					printQRInTerminal: true
				})
				let Events = new createEvents ()
				Events.getEvents(this, sock)
				sock.ev.on('messages.upsert', messages => {
					if ((messages.messages[0])?.message) this.emit("chat-update", messages.messages[0])
				})
				sock.ev.on("group-participants.update", (response) => this.emit("group-participants", response));
				sock.ev.on("contacts.upsert", response => this.emit("contacts-received", response));
				sock.ev.on("group-participants.update", response => this.emit("group-update", response))
				Events.runScript(this, sock)
				return sock
			}
			sock = startSocket()
			sock.ev.on('connection.update', (update) => {
				const { connection, lastDisconnect } = update
				if(connection === 'close') {
					const Reconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
					if (String(lastDisconnect.error).includes("Logged Out")) { sock = startSocket() }
					console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', Reconnect)
					if (Reconnect) {
						sock = startSocket()
					}
				} else if (connection === "open"){
					console.log("Open Connections")
				}
			})
			sock.ev.on('auth-state.update', () => this.saveAuth())
		} catch (err){
			console.log(err)
		}
	}
	loadAuth = () => {
		let state =  undefined;
		try {
			const getAuth = JSON.parse(fs.readFileSync(this.accounts, { encoding: 'utf-8' }), BufferJSON.reviver)
			state = {
				creds: getAuth.creds,
				keys:  initInMemoryKeyStore(getAuth.keys)
			}
		} catch {}
		return state;
	}
	getVersions = async () => {
		let respon
		try {
			const getData = await axios.get("https://web.whatsapp.com/check-update?version=1&platform=web")
			let Json = getData.data;
			respon = [Number(Json.currentVersion.split(".")[0]), Number(Json.currentVersion.split(".")[1]), Number(Json.currentVersion.split(".")[2])]
		} catch (err) {
			console.log(err)
			respon = [2, 2134, 10]
		}
		return respon
	}
	saveAuth = (state) => {
		state =  state || sock?.authState;
		fs.writeFileSync(this.accounts,  JSON.stringify(state, BufferJSON.replacer, 2))
	}
}
