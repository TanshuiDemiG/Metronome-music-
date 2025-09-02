# 专业节拍器 / Professional Metronome

一个支持中英文双语的现代化节拍器PWA应用。
A modern bilingual metronome PWA application.

## ✨ 主要特性 / Main Features

- **精准节拍 / Precise Beat**: 30-300 BPM范围 / 30-300 BPM range
- **多种拍号 / Multiple Time Signatures**: 2/4, 3/4, 4/4, 6/8等 / 2/4, 3/4, 4/4, 6/8, etc.
- **音量控制 / Volume Control**: 0-100%调节 / 0-100% adjustment
- **双语支持 / Bilingual Support**: 中英文实时切换 / Real-time Chinese-English switching
- **PWA应用 / PWA App**: 可安装到手机主屏幕 / Installable to home screen
- **离线使用 / Offline Usage**: 支持离线功能 / Offline functionality support

## 🚀 快速开始 / Quick Start

### 在线访问 / Online Access
1. 访问GitHub Pages或其他托管平台 / Visit GitHub Pages or other hosting platforms
2. 点击右上角"中/EN"按钮切换语言 / Click "中/EN" button to switch language
3. 可添加到手机主屏幕作为PWA使用 / Can be added to home screen as PWA

### 本地运行 / Local Development
```bash
# 启动本地服务器 / Start local server
python -m http.server 8000
# 或者 / Or
npx serve .
```

## 📁 项目结构 / Project Structure

```
├── index.html          # 主页面 / Main page
├── style.css           # 样式 / Styles  
├── script.js           # 核心逻辑 / Core logic
├── i18n.js            # 国际化 / i18n
├── manifest.json       # PWA配置 / PWA config
├── sw.js              # Service Worker
├── README.md          # 说明文档 / Documentation
└── deployment-guide.md # 部署指南 / Deployment guide
```

## 🎯 使用说明 / Usage

### 基本操作 / Basic Operations
- **播放/暂停**: 点击播放按钮或空格键 / Click play button or spacebar
- **调节BPM**: 使用+/-按钮或输入数值 / Use +/- buttons or input value
- **切换拍号**: 选择下拉菜单中的拍号 / Select time signature from dropdown
- **音量控制**: 拖动滑块调节 / Drag slider to adjust
- **语言切换**: 点击右上角"中/EN"按钮 / Click "中/EN" button

### 键盘快捷键 / Keyboard Shortcuts
- `空格键`: 播放/暂停 / Play/Pause
- `↑/↓`: BPM ±1
- `Shift + ↑/↓`: BPM ±10

## ⚙️ 技术规格 / Technical Specifications

- **兼容性**: 现代浏览器 / Modern browsers
- **技术栈**: 原生JavaScript + CSS3 / Vanilla JavaScript + CSS3
- **PWA**: Service Worker + Manifest
- **音频**: Web Audio API
- **国际化**: 自定义i18n / Custom i18n

## 📱 移动端适配 / Mobile Adaptation

- **响应式设计**: 适配各种屏幕尺寸 / Responsive design for various screen sizes
- **触控优化**: 适合移动设备的交互 / Touch-optimized interactions
- **PWA支持**: 可安装到主屏幕 / Installable to home screen
- **离线功能**: Service Worker缓存 / Service Worker caching

## 🛠️ 开发 / Development

```bash
# 克隆项目 / Clone project
git clone https://github.com/TanshuiDemiG/Metronome-music-.git
cd Metronome-music-

# 启动服务器 / Start server
python -m http.server 8000
# 访问 / Access: http://localhost:8000
```

## 🌐 部署 / Deployment

支持多种免费部署平台 / Support multiple free deployment platforms:
- GitHub Pages
- Netlify  
- Vercel
- Surge.sh

详见 `deployment-guide.md` / See `deployment-guide.md` for details

## 📝 更新日志 / Changelog

### v2.0.0 (Latest)
- ✨ 双语支持 / Bilingual support
- 📱 PWA功能 / PWA functionality  
- 🌐 国际化 / Internationalization
- 🔧 性能优化 / Performance optimization

## 📄 许可证 / License

MIT License

## 💬 支持 / Support

- 🐛 问题反馈 / Issues: [GitHub Issues](https://github.com/TanshuiDemiG/Metronome-music-/issues)
- 💡 功能建议 / Suggestions: [GitHub Discussions](https://github.com/TanshuiDemiG/Metronome-music-/discussions)