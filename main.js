const audioContext = new AudioContext();

const startAudio = async (context) => {
    await context.audioWorklet.addModule('processor.js');
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const micNode = context.createMediaStreamSource(mediaStream);
    const volumeMeterNode = new AudioWorkletNode(context, 'volume-meter');
    micNode.connect(volumeMeterNode).connect(context.destination);
};

window.addEventListener('load', async () => {
    const buttonEl = document.getElementById('button-start');
    if (buttonEl) {
        buttonEl.disabled = false;
    }
    buttonEl.addEventListener('click', async () => {
        await startAudio(audioContext);
        audioContext.resume();
        buttonEl.disabled = true;
        buttonEl.textContent = 'ALLOWED';
    }, false);
});