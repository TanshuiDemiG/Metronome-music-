// 国际化配置文件 - Internationalization Configuration
const i18n = {
    // 当前语言 - Current Language
    currentLang: localStorage.getItem('metronome-lang') || 'zh',
    
    // 语言包 - Language Packages
    languages: {
        zh: {
            // 页面标题 - Page Title
            title: '专业节拍器',
            subtitle: 'Professional Metronome',
            
            // 主要控制 - Main Controls
            play: '播放/暂停',
            pause: '暂停',
            stop: '停止',
            reset: '重置',
            
            // BPM控制 - BPM Controls
            bpm: 'BPM',
            bpmLabel: '节拍速度 (40-200 BPM)',
            slow: '慢',
            fast: '快',
            bpmDown: '减少BPM',
            bpmUp: '增加BPM',
            
            // 节拍模式 - Beat Patterns
            timeSignature: '拍号选择',
            beat44: '4/4',
            beat34: '3/4',
            beat24: '2/4',
            beat68: '6/8',
            
            // 音效选择 - Sound Effects
            soundEffect: '音效选择',
            click: '滴答',
            beep: '蜂鸣',
            wood: '木块',
            digital: '电子',
            
            // 音量控制 - Volume Control
            volume: '音量控制',
            mute: '静音',
            
            // 预设BPM - BPM Presets
            presets: '预设',
            largo: '广板',
            andante: '行板',
            moderato: '中板',
            allegro: '快板',
            presto: '急板',
            
            // 设置 - Settings
            settings: '设置',
            language: '语言',
            theme: '主题',
            lightMode: '浅色模式',
            darkMode: '深色模式',
            autoMode: '跟随系统',
            
            // 帮助信息 - Help Information
            help: '帮助',
            shortcuts: '快捷键',
            spacePlay: '空格键：播放/暂停',
            arrowKeys: '方向键：调节BPM',
            numberKeys: '数字键：切换拍号',
            resetKey: 'R键：重置BPM',
            
            // 手势提示 - Gesture Tips
            gestures: '手势操作',
            swipeUp: '上滑：增加BPM',
            swipeDown: '下滑：减少BPM',
            swipeLeft: '左滑：切换拍号',
            swipeRight: '右滑：切换拍号',
            tap: '点击：播放/暂停',
            doubleTap: '双击：重置BPM',
            
            // PWA相关 - PWA Related
            install: '安装应用',
            installPrompt: '将此应用添加到主屏幕',
            installInstructions: '点击分享按钮，然后选择"添加到主屏幕"',
            updateAvailable: '发现新版本',
            updatePrompt: '是否立即更新？',
            
            // 错误信息 - Error Messages
            audioError: '音频初始化失败',
            browserNotSupported: '浏览器不支持此功能',
            
            // 状态信息 - Status Messages
            playing: '播放中',
            paused: '已暂停',
            stopped: '已停止'
        },
        
        en: {
            // Page Title
            title: 'Professional Metronome',
            subtitle: '专业节拍器',
            
            // Main Controls
            play: 'Play/Pause',
            pause: 'Pause',
            stop: 'Stop',
            reset: 'Reset',
            
            // BPM Controls
            bpm: 'BPM',
            bpmLabel: 'Beat Speed (40-200 BPM)',
            slow: 'Slow',
            fast: 'Fast',
            bpmDown: 'Decrease BPM',
            bpmUp: 'Increase BPM',
            
            // Beat Patterns
            timeSignature: 'Time Signature',
            beat44: '4/4',
            beat34: '3/4',
            beat24: '2/4',
            beat68: '6/8',
            
            // Sound Effects
            soundEffect: 'Sound Effect',
            click: 'Click',
            beep: 'Beep',
            wood: 'Wood',
            digital: 'Digital',
            
            // Volume Control
            volume: 'Volume Control',
            mute: 'Mute',
            
            // BPM Presets
            presets: 'Presets',
            largo: 'Largo',
            andante: 'Andante',
            moderato: 'Moderato',
            allegro: 'Allegro',
            presto: 'Presto',
            
            // Settings
            settings: 'Settings',
            language: 'Language',
            theme: 'Theme',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
            autoMode: 'Follow System',
            
            // Help Information
            help: 'Help',
            shortcuts: 'Shortcuts',
            spacePlay: 'Space: Play/Pause',
            arrowKeys: 'Arrow Keys: Adjust BPM',
            numberKeys: 'Number Keys: Switch Time Signature',
            resetKey: 'R Key: Reset BPM',
            
            // Gesture Tips
            gestures: 'Gestures',
            swipeUp: 'Swipe Up: Increase BPM',
            swipeDown: 'Swipe Down: Decrease BPM',
            swipeLeft: 'Swipe Left: Switch Time Signature',
            swipeRight: 'Swipe Right: Switch Time Signature',
            tap: 'Tap: Play/Pause',
            doubleTap: 'Double Tap: Reset BPM',
            
            // PWA Related
            install: 'Install App',
            installPrompt: 'Add this app to your home screen',
            installInstructions: 'Tap the share button, then select "Add to Home Screen"',
            updateAvailable: 'New version available',
            updatePrompt: 'Update now?',
            
            // Error Messages
            audioError: 'Audio initialization failed',
            browserNotSupported: 'Browser does not support this feature',
            
            // Status Messages
            playing: 'Playing',
            paused: 'Paused',
            stopped: 'Stopped'
        }
    },
    
    // 获取文本 - Get Text
    t(key) {
        const lang = this.languages[this.currentLang];
        return lang[key] || key;
    },
    
    // 获取双语文本 - Get Bilingual Text
    bt(key) {
        const zh = this.languages.zh[key] || key;
        const en = this.languages.en[key] || key;
        
        if (this.currentLang === 'zh') {
            return zh === en ? zh : `${zh} / ${en}`;
        } else {
            return zh === en ? en : `${en} / ${zh}`;
        }
    },
    
    // 切换语言 - Switch Language
    switchLang(lang) {
        if (this.languages[lang]) {
            this.currentLang = lang;
            localStorage.setItem('metronome-lang', lang);
            this.updateUI();
        }
    },
    
    // 更新UI文本 - Update UI Text
    updateUI() {
        // 更新页面标题
        document.title = this.t('title');
        
        // 更新所有带有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const isBilingual = element.hasAttribute('data-bilingual');
            
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = isBilingual ? this.bt(key) : this.t(key);
            } else if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'number')) {
                element.placeholder = isBilingual ? this.bt(key) : this.t(key);
            } else if (element.tagName === 'OPTION') {
                element.textContent = isBilingual ? this.bt(key) : this.t(key);
            } else {
                // 处理包含HTML的元素（如预设按钮）
                if (element.innerHTML.includes('<br>') || element.innerHTML.includes('<small>')) {
                    const text = isBilingual ? this.bt(key) : this.t(key);
                    const bpm = element.dataset.bpm;
                    if (bpm) {
                        element.innerHTML = `${text}<br><small>${bpm}</small>`;
                    } else {
                        element.textContent = text;
                    }
                } else {
                    element.textContent = isBilingual ? this.bt(key) : this.t(key);
                }
            }
        });
        
        // 更新aria-label属性
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });
        
        // 更新title属性
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.setAttribute('title', this.t(key));
        });
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    },
    
    // 初始化 - Initialize
    init() {
        // 创建语言切换按钮
        this.createLanguageSwitch();
        
        // 初始化UI
        this.updateUI();
        
        // 监听语言变化事件
        document.addEventListener('languageChanged', (e) => {
            console.log('Language changed to:', e.detail.language);
        });
    },
    
    // 创建语言切换按钮 - Create Language Switch Button
    createLanguageSwitch() {
        const langSwitch = document.createElement('div');
        langSwitch.className = 'language-switch';
        langSwitch.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'zh' ? 'active' : ''}" data-lang="zh">
                中文
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                English
            </button>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .language-switch {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 4px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .lang-btn {
                background: none;
                border: none;
                color: var(--text-color, #333);
                padding: 8px 16px;
                border-radius: 16px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                min-width: 60px;
            }
            
            .lang-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .lang-btn.active {
                background: var(--primary-color, #4CAF50);
                color: white;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
            }
            
            @media (max-width: 768px) {
                .language-switch {
                    top: 10px;
                    right: 10px;
                    transform: scale(0.9);
                }
            }
            
            @media (prefers-color-scheme: dark) {
                .language-switch {
                    background: rgba(0, 0, 0, 0.3);
                }
                
                .lang-btn {
                    color: var(--text-color, #fff);
                }
                
                .lang-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(langSwitch);
        
        // 添加点击事件
        langSwitch.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.getAttribute('data-lang');
                this.switchLang(lang);
                
                // 更新按钮状态
                langSwitch.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }
};

// 导出到全局 - Export to Global
window.i18n = i18n;