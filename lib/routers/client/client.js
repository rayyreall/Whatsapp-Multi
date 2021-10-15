const { default: MakeWASocket, BufferJSON, initInMemoryKeyStore,  AuthenticationState, DisconnectReason, AnyMessageContent,  delay  } = require('@adiwajshing/baileys-md')
const fs = require("fs");
const chalk = require("chalk");
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
			Events.runScript(this, sock)
			return sock
		}
		sock = startSocket()
		sock.ev.on('connection.update', (update) => {
			const { connection, lastDisconnect } = update
			if(connection === 'close') {
				if((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
					sock = startSocket ()
				} else {
					console.log('connection closed')
				}
			}
		})
		sock.ev.on('auth-state.update', () => this.saveAuth())
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
