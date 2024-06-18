let dataArray, analyser;

window.electronAPI.getMediaStream(async (value) => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: value,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
            }
        },
        audio: {
            mandatory: {
                chromeMediaSource: 'desktop'
            }
        }
    })

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    mediaStreamSource.connect(analyser);
})

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);

    if (dataArray != undefined) {
        analyser.getByteFrequencyData(dataArray);
        window.electronAPI.setSoundArray(dataArray);

        for (let i = 0; i < dataArray.byteLength; i++) {
            stroke(255, 0, 255);
            line((i / dataArray.byteLength) * width, height - (dataArray[i] / 256) * height, (i / dataArray.byteLength) * width, height);
        }
    }
}