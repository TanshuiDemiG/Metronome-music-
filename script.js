class Metronome {
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
        this.scheduleAheadTime = 25.0; // 提前调度时间（毫秒）
        this.timerWorker = null;
        
        // DOM元素
        this.initElements();
        
        // 音频缓冲区
        this.audioBuffers = {};
        
        // 初始化
        this.init();
    }
    
    initElements() {
        // 获取所有需要的DOM元素
        this.playBtn = document.getElementById('playBtn');
        this.bpmValue = document.getElementById('bpmValue');
        this.bpmSlider = document.getElementById('bpmSlider');
        this.bpmDecrease = document.getElementById('bpmDecrease');
        this.bpmIncrease = document.getElementById('bpmIncrease');
        this.currentBeatSpan = document.getElementById('currentBeat');
        this.totalBeatsSpan = document.getElementById('totalBeats');
        this.beatCircle = document.getElementById('beatCircle');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.soundSelect = document.getElementById('soundSelect');
        this.signatureButtons = document.querySelectorAll('.signature-btn');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        this.beatBars = document.querySelectorAll('.beat-bar');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
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
        // 创建Web Worker用于精确计时
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
        // 生成不同类型的节拍音效
        const sampleRate = this.audioContext.sampleRate;
        
        // 经典滴答声
        this.audioBuffers.click = this.generateClickSound(sampleRate);
        
        // 电子哔声
        this.audioBuffers.beep = this.generateBeepSound(sampleRate);
        
        // 木质敲击声
        this.audioBuffers.wood = this.generateWoodSound(sampleRate);
        
        // 数字音效
        this.audioBuffers.digital = this.generateDigitalSound(sampleRate);
    }
    
    generateClickSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.1); // 0.1秒
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // 生成短促的点击声
            data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 50);
        }
        
        return buffer;
    }
    
    generateBeepSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.15);
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // 生成电子哔声
            data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 10) * 0.5;
        }
        
        return buffer;
    }
    
    generateWoodSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.08);
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // 生成木质敲击声（低频+噪音）
            const noise = (Math.random() - 0.5) * 0.3;
            data[i] = (Math.sin(2 * Math.PI * 200 * t) + noise) * Math.exp(-t * 30);
        }
        
        return buffer;
    }
    
    generateDigitalSound(sampleRate) {
        const length = Math.floor(sampleRate * 0.12);
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // 生成数字音效（方波）
            const square = Math.sign(Math.sin(2 * Math.PI * 600 * t));
            data[i] = square * Math.exp(-t * 15) * 0.3;
        }
        
        return buffer;
    }
    
    bindEvents() {
        // 播放/暂停按钮
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // BPM控制
        this.bpmSlider.addEventListener('input', (e) => {
            this.setBPM(parseInt(e.target.value));
        });
        
        this.bpmDecrease.addEventListener('click', () => {
            this.setBPM(Math.max(40, this.bpm - 1));
        });
        
        this.bpmIncrease.addEventListener('click', () => {
            this.setBPM(Math.min(200, this.bpm + 1));
        });
        
        // 预设BPM
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const bpm = parseInt(btn.dataset.bpm);
                this.setBPM(bpm);
            });
        });
        
        // 节拍选择
        this.signatureButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTimeSignature(btn.dataset.signature);
                this.updateSignatureButtons(btn);
            });
        });
        
        // 音量控制
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
        });
        
        // 音效选择
        this.soundSelect.addEventListener('change', (e) => {
            this.soundType = e.target.value;
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        this.currentBeat = 1;
        this.nextNoteTime = this.audioContext.currentTime;
        
        // 启动计时器
        this.timerWorker.postMessage('start');
        
        // 更新界面
        this.updatePlayButton();
    }
    
    stop() {
        this.isPlaying = false;
        this.timerWorker.postMessage('stop');
        
        // 重置节拍
        this.currentBeat = 1;
        this.updateDisplay();
        this.updatePlayButton();
    }
    
    scheduler() {
        // 精确的节拍调度器
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime / 1000) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNote();
        }
    }
    
    scheduleNote(time) {
        // 播放节拍音效
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.audioBuffers[this.soundType];
        
        // 第一拍音量稍大
        const volume = this.currentBeat === 1 ? this.volume * 1.2 : this.volume;
        gainNode.gain.setValueAtTime(volume, time);
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(time);
        
        // 更新视觉效果（需要同步到主线程）
        setTimeout(() => {
            this.updateVisualBeat();
        }, (time - this.audioContext.currentTime) * 1000);
    }
    
    nextNote() {
        // 计算下一个节拍的时间
        const secondsPerBeat = 60.0 / this.bpm;
        this.nextNoteTime += secondsPerBeat;
        
        // 更新当前节拍
        this.currentBeat++;
        if (this.currentBeat > this.timeSignature.beats) {
            this.currentBeat = 1;
        }
    }
    
    updateVisualBeat() {
        // 更新节拍圆圈动画
        this.beatCircle.classList.add('active', 'pulse');
        setTimeout(() => {
            this.beatCircle.classList.remove('active', 'pulse');
        }, 100);
        
        // 更新节拍条
        this.beatBars.forEach((bar, index) => {
            bar.classList.remove('active', 'flash');
            if (index + 1 === this.currentBeat) {
                bar.classList.add('active', 'flash');
            }
        });
        
        // 更新节拍计数器
        this.updateDisplay();
    }
    
    setBPM(bpm) {
        this.bpm = Math.max(40, Math.min(200, bpm));
        this.bpmSlider.value = this.bpm;
        this.updateDisplay();
    }
    
    setTimeSignature(signature) {
        const [beats, noteValue] = signature.split('/').map(Number);
        this.timeSignature = { beats, noteValue };
        
        // 重置当前节拍
        this.currentBeat = 1;
        
        // 更新节拍条显示
        this.updateBeatBars();
        this.updateDisplay();
    }
    
    updateBeatBars() {
        // 显示/隐藏节拍条
        this.beatBars.forEach((bar, index) => {
            if (index < this.timeSignature.beats) {
                bar.style.display = 'block';
                bar.dataset.beat = index + 1;
            } else {
                bar.style.display = 'none';
            }
        });
    }
    
    updateSignatureButtons(activeBtn) {
        this.signatureButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.playBtn.classList.add('playing');
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        } else {
            this.playBtn.classList.remove('playing');
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        }
    }
    
    updateDisplay() {
        // 更新BPM显示
        this.bpmValue.textContent = this.bpm;
        
        // 更新节拍计数器
        this.currentBeatSpan.textContent = this.currentBeat;
        this.totalBeatsSpan.textContent = this.timeSignature.beats;
    }
}

// 初始化节拍器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化国际化
    if (window.i18n) {
        i18n.init();
    }
    
    const metronome = new Metronome();
    
    // 全局访问（用于调试）
    window.metronome = metronome;
});

// 处理页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.metronome && window.metronome.isPlaying) {
        // 页面隐藏时暂停（可选）
        // window.metronome.stop();
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('节拍器错误:', e.error);
});

// 音频上下文恢复（处理浏览器自动播放策略）
document.addEventListener('click', () => {
    if (window.metronome && window.metronome.audioContext.state === 'suspended') {
        window.metronome.audioContext.resume();
    }
}, { once: true });

// 移动端增强功能
class MobileEnhancements {
    constructor(metronome) {
        this.metronome = metronome;
        this.init();
    }
    
    init() {
        this.addTouchGestures();
        this.addHapticFeedback();
        this.addMobileOptimizations();
    }
    
    addTouchGestures() {
        let touchStartY = 0;
        let touchStartX = 0;
        
        // 在节拍圆圈上添加手势支持
        const beatCircle = this.metronome.beatCircle;
        
        beatCircle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            e.preventDefault();
        }, { passive: false });
        
        beatCircle.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        beatCircle.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            // 垂直滑动调整BPM
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
                const bpmChange = Math.round(deltaY / 10);
                const newBpm = Math.max(40, Math.min(200, this.metronome.bpm + bpmChange));
                this.metronome.setBPM(newBpm);
                this.triggerHapticFeedback('light');
            }
            // 水平滑动切换节拍
            else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                this.switchTimeSignature(deltaX > 0 ? -1 : 1);
                this.triggerHapticFeedback('medium');
            }
            // 点击切换播放状态
            else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                this.metronome.togglePlay();
                this.triggerHapticFeedback('heavy');
            }
            
            e.preventDefault();
        }, { passive: false });
        
        // 双击重置BPM到120
        let lastTap = 0;
        beatCircle.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                this.metronome.setBPM(120);
                this.triggerHapticFeedback('heavy');
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }
    
    switchTimeSignature(direction) {
        const signatures = ['4/4', '3/4', '2/4', '6/8'];
        const buttons = this.metronome.signatureButtons;
        let currentIndex = 0;
        
        // 找到当前激活的节拍
        buttons.forEach((btn, index) => {
            if (btn.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        // 计算新的索引
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = signatures.length - 1;
        if (newIndex >= signatures.length) newIndex = 0;
        
        // 触发点击事件
        buttons[newIndex].click();
    }
    
    addHapticFeedback() {
        // 为所有按钮添加触觉反馈
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                this.triggerHapticFeedback('light');
            });
        });
        
        // 为滑块添加触觉反馈
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            let lastValue = slider.value;
            slider.addEventListener('input', () => {
                if (Math.abs(slider.value - lastValue) >= 5) {
                    this.triggerHapticFeedback('light');
                    lastValue = slider.value;
                }
            });
        });
    }
    
    triggerHapticFeedback(intensity = 'light') {
        if ('vibrate' in navigator) {
            switch (intensity) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(25);
                    break;
                case 'heavy':
                    navigator.vibrate([50, 10, 50]);
                    break;
            }
        }
    }
    
    addMobileOptimizations() {
        // 防止双击缩放，但允许按钮正常工作
        document.addEventListener('touchend', (e) => {
            if (e.target.tagName !== 'INPUT' && 
                e.target.tagName !== 'SELECT' && 
                e.target.tagName !== 'BUTTON' &&
                !e.target.classList.contains('play-btn') &&
                !e.target.closest('button')) {
                e.preventDefault();
            }
        });
        
        // 防止长按选择文本
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
                e.preventDefault();
            }
        });
        
        // 优化滚动行为
        document.body.style.overscrollBehavior = 'none';
        
        // 屏幕方向变化处理
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // 重新计算布局
                window.scrollTo(0, 0);
            }, 100);
        });
        
        // 添加PWA支持提示
        this.addPWAPrompt();
    }
    
    addPWAPrompt() {
        // 检测是否为iOS Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isStandalone = window.navigator.standalone;
        
        if (isIOS && !isStandalone) {
            // 创建添加到主屏幕提示
            const prompt = document.createElement('div');
            prompt.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-size: 14px;
                text-align: center;
                z-index: 1000;
                display: none;
            `;
            prompt.innerHTML = `
                <p>💡 提示：点击分享按钮 <span style="font-size: 18px;">⬆️</span> 然后选择"添加到主屏幕"以获得更好的体验</p>
                <button onclick="this.parentElement.style.display='none'" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    margin-top: 10px;
                    cursor: pointer;
                ">知道了</button>
            `;
            
            document.body.appendChild(prompt);
            
            // 延迟显示提示
            setTimeout(() => {
                prompt.style.display = 'block';
            }, 3000);
            
            // 5秒后自动隐藏
            setTimeout(() => {
                prompt.style.display = 'none';
            }, 10000);
        }
    }
}

// 初始化移动端增强功能
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.metronome) {
            new MobileEnhancements(window.metronome);
        }
    }, 100);
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}