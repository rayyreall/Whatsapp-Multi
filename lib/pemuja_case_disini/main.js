module.exports.PemujaCase = () => {
	global.client.open("memuja case", async (data, Cli) => {
		const { from, id, args, command, prefix } = data;
		switch(command) {
			case prefix + "menu":
			  Cli.sendText(from, "menu bikin sendiri")
			break
		}
	})
}