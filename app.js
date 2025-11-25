// Access the globals loaded via <script> tags
const { FFmpeg } = FFmpegWASM;
const { fetchFile, toBlobURL } = FFmpegUtil;

const ffmpeg = new FFmpeg();
const statusElem = document.getElementById('status');
const terminal = document.getElementById('terminal');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const btnAudio = document.getElementById('btn-audio');
const btnGif = document.getElementById('btn-gif');
const resultArea = document.getElementById('result-area');

let currentFile = null;

// --- Utility: Logger ---
const log = (msg, type = 'text') => {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `> ${msg}`;
    terminal.appendChild(entry);
    terminal.scrollTop = terminal.scrollHeight;
};

// --- 1. Initialize WASM ---
const loadFFmpeg = async () => {
    // We point to the specific version to ensure compatibility
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    ffmpeg.on('log', ({ message }) => log(message));

    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        statusElem.innerText = "[ SYSTEM READY ]";
        statusElem.classList.remove('busy');
    } catch (e) {
        log(`CRITICAL ERROR: ${e.message}`, 'error');
        console.error(e);
        statusElem.innerText = "[ ERROR ]";
    }
};

// --- 2. File Handling ---
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

const handleFile = (file) => {
    currentFile = file;
    log(`File loaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, 'info');
    dropZone.innerText = `[ LOADED: ${file.name} ]`;
    btnAudio.disabled = false;
    btnGif.disabled = false;
};

// --- 3. Core Functions ---

// A. Audio Extraction
btnAudio.addEventListener('click', async () => {
    if (!currentFile) return;
    setBusy(true);
    
    const inputName = 'input.mp4';
    const outputName = 'output.aac';

    await ffmpeg.writeFile(inputName, await fetchFile(currentFile));

    log('Starting Audio Extraction (Stream Copy)...', 'info');
    
    // -vn: No Video, -c:a copy: Copy audio stream
    await ffmpeg.exec(['-i', inputName, '-vn', '-c:a', 'copy', outputName]);

    const data = await ffmpeg.readFile(outputName);
    createDownloadLink(data, 'audio/aac', 'extracted_audio.aac');
    
    setBusy(false);
});

// B. GIF Generation
btnGif.addEventListener('click', async () => {
    if (!currentFile) return;
    setBusy(true);

    const inputName = 'input.mp4';
    const paletteName = 'palette.png';
    const outputName = 'output.gif';

    await ffmpeg.writeFile(inputName, await fetchFile(currentFile));

    log('Phase 1: Generating optimal color palette...', 'info');
    // FPS 10, Width 320px (Height auto)
    await ffmpeg.exec([
        '-i', inputName, 
        '-vf', 'fps=10,scale=320:-1:flags=lanczos,palettegen', 
        '-y', paletteName
    ]);

    log('Phase 2: Encoding GIF...', 'info');
    await ffmpeg.exec([
        '-i', inputName, 
        '-i', paletteName, 
        '-filter_complex', 'fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse', 
        '-y', outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    resultArea.innerHTML = `<img src="${url}" alt="GIF Result" /><br><br>`;
    createDownloadLink(data, 'image/gif', 'animation.gif', false);

    setBusy(false);
});

// --- Helpers ---
const setBusy = (isBusy) => {
    if (isBusy) {
        statusElem.innerText = "[ PROCESSING... ]";
        statusElem.classList.add('busy');
        btnAudio.disabled = true;
        btnGif.disabled = true;
    } else {
        statusElem.innerText = "[ SYSTEM READY ]";
        statusElem.classList.remove('busy');
        btnAudio.disabled = false;
        btnGif.disabled = false;
    }
};

const createDownloadLink = (data, type, filename, clear = true) => {
    const url = URL.createObjectURL(new Blob([data.buffer], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.innerText = `[ DOWNLOAD ${filename.toUpperCase()} ]`;
    a.style.color = 'var(--accent)';
    a.style.fontWeight = 'bold';
    
    if (clear) resultArea.innerHTML = '';
    resultArea.appendChild(a);
};

// Start
loadFFmpeg();
