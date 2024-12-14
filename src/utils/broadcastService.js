let instance;

class BroadcastService {
	constructor(channelName) {
		if (!instance) {
			this.channel = new BroadcastChannel(channelName);
			instance = this;
		}
		return instance;
	}

	sendMessage(message) {
		this.channel.postMessage(message);
	}

	onMessage(callback) {
		this.channel.onmessage = (event) => {
			callback(event.data);
		};
	}

	closeChannel() {
		// Solo cierra si existe el canal
		if (this.channel) {
			this.channel.close();
			this.channel = null;
		}
	}
}

const broadcastService = new BroadcastService('mi-canal');
export default broadcastService;
