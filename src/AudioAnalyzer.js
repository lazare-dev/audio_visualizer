//src/AudioAnalyzer.js

class AudioAnalyzer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
        
        this.captureBrowserAudio();

        this.resumeContext = this.resumeContext.bind(this);
        document.addEventListener('click', this.resumeContext);
        document.addEventListener('keydown', this.resumeContext);
    }

    captureBrowserAudio() {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(stream => {
            const audioTrack = stream.getAudioTracks()[0];
            this.microphone = this.audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
            this.microphone.connect(this.analyser);
            this.analyser.fftSize = 2048;
        }).catch(error => {
            console.error('Error capturing browser audio:', error);
        });
    }

    resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    getFrequencyData() {
        this.analyser.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }

    getTimeDomainData() {
        this.analyser.getByteTimeDomainData(this.timeDomainData);
        return this.timeDomainData;
    }
}

window.AudioAnalyzer = AudioAnalyzer;

