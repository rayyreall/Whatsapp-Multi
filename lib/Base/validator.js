class Validations {
	getEventsParse (chats) {
		const from = chats.key.remoteJid;
		const pushname = chats.pushName;
		const message = chats.message?.ephemeralMessage || chats;
		const isGroupMsg = from.endsWith("@g.us");
		const type = Object.keys(message.message || "")[0];
		const quotedType = message.message?.extendedTextMessage?.contextInfo?.quotedMessage ? Object.keys(message.message.extendedTextMessage.contextInfo.quotedMessage) : null;
		const typeQuoted = type == 'extendedTextMessage' && message?.message?.extendedTextMessage ? Object.keys(message.message.extendedTextMessage.contextInfo ? message.message.extendedTextMessage.contextInfo.quotedMessage ? message.message.extendedTextMessage.contextInfo.quotedMessage : { mentionedText: 'RA BOT' } : { thumbnailMessage: 'I`am Ra' })[0] : type;
		const quotedMsg = message.message?.extendedTextMessage?.contextInfo || message.message?.imageMessage?.contextInfo || message.message?.videoMessage?.contextInfo || message.message?.audioMessage?.contextInfo || message.message?.orderMessage?.contextInfo || message.message?.buttonsMessage?.contextInfo || message.message?.buttonsResponseMessage?.contextInfo ||
		message.message?.listMessage?.contextInfo || message.message?.liveLocationMessage?.contextInfo || message.message?.locationMessage?.contextInfo || message.message?.stickerMessage?.contextInfo || message.message?.templateMessage?.contextInfo || message.message?.productMessage?.contextInfo || message.message?.contactMessage?.contextInfo || message.message?.documentMessage?.contextInfo ||
		message.message?.orderMessage?.contextInfo;
		const quotedBody = typeQuoted === "conversation" ? quotedMsg?.quotedMessage?.conversation : typeQuoted === "imageMessage" ? quotedMsg?.quotedMessage?.imageMessage?.caption : typeQuoted === "videoMessage" ? quotedMsg?.quotedMessage?.videoMessage?.caption : typeQuoted === "buttonsMessage" ? quotedMsg?.quotedMessage?.buttonsMessage?.text : typeQuoted === "buttonsResponseMessage" ? quotedMsg?.quotedMessage?.buttonsResponseMessage?.selectedDisplayText :
		typeQuoted === "listMessage" ? quotedMsg?.quotedMessage?.listMessage?.title : typeQuoted === "templateMessage" ? quotedMsg?.quotedMessage?.templateMessage?.hydratedTemplate?.hydratedContentText : null;
		const body  = message.message?.conversation || message.message?.extendedTextMessage?.text || message.message?.imageMessage?.caption || message.message?.videoMessage?.caption || message.message?.viewOnceMessage?.message?.imageMessage?.caption || message.message?.viewOnceMessage?.message?.videoMessage?.caption || message.message?.templateMessage?.hydratedTemplate?.hydratedTitleText || message.message?.buttonsResponseMessage?.selectedDisplayText || message.message?.listResponseMessage?.title || " ";
		let [command, ...args] =  body.split(" ")
		args = args || []
		command = command.toLowerCase()
		const getIdButton = message.message?.buttonsResponseMessage?.selectedButtonId || null
		let media = message?.message?.imageMessage || message?.message?.videoMessage || message?.message?.documentMessage || message?.message?.stickerMessage ? message
		: message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage || message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage ? JSON.parse(JSON.stringify(message).replace('quotedM', 'm')).message?.extendedTextMessage?.contextInfo
        : message?.message?.viewOnceMessage ? message.message.viewOnceMessage  : quotedMsg ? quotedMsg.quotedMessage?.viewOnceMessage ? {  stanzaId: quotedMsg.stanzaId, ...quotedMsg.quotedMessage?.viewOnceMessage } : quotedMsg.quotedMessage?.buttonsMessage ?  quotedMsg.quotedMessage.buttonsMessage.imageMessage ? { stanzaId: quotedMsg.stanzaId, message: { imageMessage: quotedMsg.quotedMessage.buttonsMessage.imageMessage }} : quotedMsg.quotedMessage.buttonsMessage.videoMessage ? { stanzaId: quotedMsg.stanzaId, message: { videoMessage:  quotedMsg.quotedMessage.buttonsMessage.videoMessage }} :  quotedMsg.quotedMessage.buttonsMessage.documentMessage ? { stanzaId: quotedMsg.stanzaId, message: { documentMessage:  quotedMsg.quotedMessage.buttonsMessage.documentMessage }} : null : null : message?.message?.buttonsMessage ? message.message.buttonsMessage.imageMessage ? { participant: chats?.participant, message: { imageMessage: message.message.buttonsMessage.imageMessage}} :  message.message.buttonsMessage.videoMessage ? { participant: chats?.participant, message: { videoMessage: message.message.buttonsMessage.videoMessage}}
		: message.message.buttonsMessage.documentMessage ? { participant: chats?.participant, message: { documentMessage: message.message.buttonsMessage.videoMessage}} : null : null;
		const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid && message.message.extendedTextMessage.contextInfo.mentionedJid.length > 0 ? message.message.extendedTextMessage.contextInfo.mentionedJid : message?.message?.extendedTextMessage?.contextInfo?.quotedMessage && message.message.extendedTextMessage.contextInfo.participant ? [message.message.extendedTextMessage.contextInfo.participant] : [];
		return { from, pushname, isGroupMsg, type, quotedType, typeQuoted, quotedBody, body, command, args, getIdButton, media, mentioned, message }
	}
}

module.exports.Validations = Validations;