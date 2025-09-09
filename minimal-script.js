class MinimalMetronome {
    constructor() {
        // 基本属性
        this.bpm = 120;
        this.isPlaying = false;
        this.currentBeat = 1;
        this.timeSignature = { beats: 4, noteValue: 4 };
        this.volume = 0.7;
        this.soundType = 'click';
        
        // 计时器相关
        this.audioContext = null;
        this.nextNoteTime = 0.0;
        this.scheduleAheadTime = 25.0;
        this.timerWorker = null;
        
        // DOM元素
        this.initElements();
        
        // 音频缓冲区
        this.audioBuffers = {};
        
        // 初始化
        this.init();
    }
    
    initElements() {
        // 获取极简设计的DOM元素
        this.playBtn = document.getElementById('playBtn');
        this.bpmValue = document.getElementById('bpmValue');
        this.bpmSlider = document.getElementById('bpmSlider');
        this.currentBeatSpan = document.getElementById('currentBeat');
        this.beatIndicator = document.getElementById('beatIndicator');
        this.bpmCenter = document.getElementById('bpmCenter');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.soundSelect = document.getElementById('soundSelect');
        this.signatureButtons = document.querySelectorAll('.signature-btn');
        this.beatBars = document.querySelectorAll('.beat-bar');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
        this.controlsToggle = document.getElementById('controlsToggle');
        this.controlsPanel = document.getElementById('controlsPanel');
    }
    
    async init() {
        // 初始化音频上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建Web Worker用于精确计时
        this.createTimerWorker();
        
        // 生成音频缓冲区
        await this.generateAudioBuffers();
        
        // 绑定事件
        this.bindEvents();
        
        // 更新界面
        this.updateDisplay();
    }
    
    createTimerWorker() {
        const workerScript = `
            let timerID = null;
            let interval = 100;
            
            self.onmessage = function(e) {
                if (e.data === "start") {
                    timerID = setInterval(function() {
                        postMessage("tick");
                    }, interval);
                } else if (e.data.interval) {
                    interval = e.data.interval;
                    if (timerID) {
                        clearInterval(timerID);
                        timerID = setInterval(function() {
                            postMessage("tick");
                        }, interval);
                    }
                } else if (e.data === "stop") {
                    clearInterval(timerID);
                    timerID = null;
                }
            };
        `;
        
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        this.timerWorker = new Worker(URL.createObjectURL(blob));
        
        this.timerWorker.onmessage = (e) => {
            if (e.data === 'tick') {
                this.scheduler();
            }
        };
    }
    
    async generateAudioBuffers() {
        const sampleRate = this.audioContext.sampleRate;
        
        // 生成不同类型的节拍音效
        const sounds = {
            click: this.generateClickSound(sampleRate),
            beep: this.generateBeepSound(sampleRate),
            wood: this.generateWoodSound(sampleRate),
            digital: this.generateDigitalSound(sampleRate)
        };
        
        for (const [type, audioData] of Object.entries(sounds)) {
            const buffer = this.audioContext.createBuffer(1, audioData.length, sampleRate);
            buffer.getChannelData(0).set(audioData);
            this.audioBuffers[type] = buffer;
        }
    }
    
    generateClickSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.1);
        const audioData = new Float32Array(length);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            audioData[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 30);
        }
        
        return audioData;
    }
    
    generateBeepSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.15);
        const audioData = new Float32Array(length);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            audioData[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 10);
        }
        
        return audioData;
    }
    
    generateWoodSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.08);
        const audioData = new Float32Array(length);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() - 0.5) * 2;
            audioData[i] = noise * Math.exp(-t * 50) * 0.5;
        }
        
        return audioData;
    }
    
    generateDigitalSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.12);
        const audioData = new Float32Array(length);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            audioData[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 20) * 0.8;
        }
        
        return audioData;
    }
    
    bindEvents() {
        // 播放/暂停按钮
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // BPM滑块
        this.bpmSlider.addEventListener('input', (e) => {
            this.setBPM(parseInt(e.target.value));
        });
        
        // 音量控制
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
        });
        
        // 音效选择
        this.soundSelect.addEventListener('change', (e) => {
            this.soundType = e.target.value;
        });
        
        // 节拍选择
        this.signatureButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.dataset.signature) {
                    this.setTimeSignature(e.target.dataset.signature);
                } else if (e.target.dataset.bpm) {
                    this.setBPM(parseInt(e.target.dataset.bpm));
                }
            });
        });
        
        // 控制面板切换
        this.controlsToggle.addEventListener('click', () => {
            this.toggleControlsPanel();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
        });
        
        // 双击BPM中心区域切换播放
        this.bpmCenter.addEventListener('dblclick', () => {
            this.togglePlay();
        });
    }
    
    toggleControlsPanel() {
        this.controlsPanel.classList.toggle('open');
        this.controlsToggle.classList.toggle('open');
    }
    
    togglePlay() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        this.isPlaying = true;
        this.currentBeat = 1;
        this.nextNoteTime = this.audioContext.currentTime;
        this.timerWorker.postMessage('start');
        this.updatePlayButton();
        this.bpmCenter.classList.add('active');
    }
    
    stop() {
        this.isPlaying = false;
        this.timerWorker.postMessage('stop');
        this.updatePlayButton();
        this.bpmCenter.classList.remove('active');
        this.resetBeatVisualization();
    }
    
    scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime / 1000) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNote();
        }
    }
    
    scheduleNote(time) {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.audioBuffers[this.soundType];
        gainNode.gain.value = this.volume * (this.currentBeat === 1 ? 1.2 : 0.8);
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(time);
        
        // 安排UI更新
        setTimeout(() => {
            this.updateBeatVisualization();
        }, (time - this.audioContext.currentTime) * 1000);
    }
    
    nextNote() {
        const secondsPerBeat = 60.0 / this.bpm;
        this.nextNoteTime += secondsPerBeat;
        
        this.currentBeat++;
        if (this.currentBeat > this.timeSignature.beats) {
            this.currentBeat = 1;
        }
    }
    
    updateBeatVisualization() {
        // 更新节拍指示器
        this.currentBeatSpan.textContent = this.currentBeat;
        this.beatIndicator.classList.add('pulse');
        setTimeout(() => {
            this.beatIndicator.classList.remove('pulse');
        }, 200);
        
        // 更新节拍条
        this.beatBars.forEach((bar, index) => {
            bar.classList.toggle('active', index + 1 === this.currentBeat);
        });
    }
    
    resetBeatVisualization() {
        this.currentBeat = 1;
        this.currentBeatSpan.textContent = '1';
        this.beatBars.forEach((bar, index) => {
            bar.classList.toggle('active', index === 0);
        });
    }
    
    setBPM(bpm) {
        this.bpm = Math.max(40, Math.min(200, bpm));
        this.updateDisplay();
    }
    
    setTimeSignature(signature) {
        const [beats, noteValue] = signature.split('/').map(Number);
        this.timeSignature = { beats, noteValue };
        
        // 更新节拍条数量
        const beatBarsContainer = document.getElementById('beatBars');
        beatBarsContainer.innerHTML = '';
        
        for (let i = 1; i <= beats; i++) {
            const bar = document.createElement('div');
            bar.className = 'beat-bar';
            bar.dataset.beat = i;
            if (i === 1) bar.classList.add('active');
            beatBarsContainer.appendChild(bar);
        }
        
        this.beatBars = document.querySelectorAll('.beat-bar');
        this.currentBeat = 1;
        
        // 更新按钮状态
        this.signatureButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.signature === signature);
        });
    }
    
    updateDisplay() {
        this.bpmValue.textContent = this.bpm;
        this.bpmSlider.value = this.bpm;
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        }
    }
}

// 初始化节拍器
document.addEventListener('DOMContentLoaded', () => {
    window.metronome = new MinimalMetronome();
});