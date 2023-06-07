class Queue {
    constructor(voiceChannel) {
        this.voiceChannel = voiceChannel;
        this.connection = null;
        this.songs = [];
        this.playing = true;
        this.repeat = false;
    }
}

module.exports = Queue;