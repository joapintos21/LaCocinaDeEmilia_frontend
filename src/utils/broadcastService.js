class BroadcastService {
	constructor(channelName) {
		if (!BroadcastService.instance) {
			this.channel = new BroadcastChannel(channelName);
			BroadcastService.instance = this;
		}
		return BroadcastService.instance;
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
		if (this.channel) {
			this.channel.close();
			this.channel = null;
		}
	}
}

const broadcastService = new BroadcastService('mi-canal');
Object.freeze(broadcastService);

export default broadcastService;
