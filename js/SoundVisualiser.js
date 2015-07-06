/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

/**
 * Sound.js
 *
 *    @class Sound
 *    @constructor
 *    @param {Object} config Settings object
 *    @param {String} config.source Either 'microphone' or file path for song
 *    @param {Number} config.fftSize
 *    @param {Number} config.smoothingTimeConstant
 *    @param {Number} config.minDecibels
 *    @param {Number} config.maxDecibels
 */

var SoundVisualiser = function (config) {
    this.source = null;
    this.sourcePath = config.sourcePath || 'microphone';
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.setupAnalyser(this, config);

    if (this.sourcePath === 'microphone') {
        this.setupMicrophone(this);
    }
};

SoundVisualiser.prototype.setupMicrophone = function () {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.webkitGetUserMedia({
            audio: true
        },
        this.gotStream.bind(this),
        this.lostStream);
};

SoundVisualiser.prototype.setupAnalyser = function (config) {
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = config.fftSize || 32;
    this.analyser.smoothingTimeConstant = config.smoothingTimeConstant || 0.95;
    this.analyser.minDecibels = config.minDecibels || -70;
    this.analyser.maxDecibels = config.maxDecibels || -10;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
};

SoundVisualiser.prototype.gotStream = function (stream) {
    this.source = this.context.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
};

SoundVisualiser.prototype.lostStream = function (e) {
    console.log(e);
};

SoundVisualiser.prototype.getData = function () {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
}
