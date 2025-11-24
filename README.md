# Cursor Creature 🎨✨

An interactive WebGL shader visualizer that brings colorful, animated ring creatures to life in a cosmic universe. Created with Cursor AI, this project combines advanced shader techniques with real-time interactive controls.

![WebGL Shader Visualizer](https://img.shields.io/badge/WebGL-Shader%20Visualizer-blue)
![Three.js](https://img.shields.io/badge/Three.js-r128-green)
![GLSL](https://img.shields.io/badge/GLSL-Shaders-purple)

## 🌟 Features

### Visual Effects
- **Colorful Ring Creatures**: Multiple glowing rings with vibrant rainbow gradients (magenta, purple, cyan, green, yellow)
- **Cosmic Universe Background**: Starfield with parallax scrolling and subtle nebula clouds
- **Dynamic Movement**: Rings rotate and orbit with smooth animations
- **Sparkle Particles**: Random sparkles that dance around the rings
- **Organic Distortion**: Noise-based organic movement for natural feel

### Interactive Controls
- **Ring Radius**: Control the size of the ring creatures
- **Glow Intensity**: Adjust the brightness and spread of the glow
- **Animation Speed**: Control how fast everything moves
- **Color Shift**: Shift the color palette over time
- **Ring Count**: Add or remove rings (1-5 rings)
- **Noise Amount**: Control organic distortion

### Animation System
- **6 Demo Animations**: Pre-built animation sequences
  - Bounce Radius - Elastic bounce effect
  - Color Shift - Smooth color transitions
  - Timeline - Complex sequenced animations
  - Parallel - Simultaneous animations
  - Elastic Pulse - Continuous pulsing
  - Speed Variation - Speed oscillation

### Advanced Techniques
- **Distance Fields (SDF)**: Precise shape rendering
- **Smooth Blending**: Organic ring intersections
- **30+ Easing Functions**: Professional animation curves
- **Timeline System**: Complex animation orchestration
- **Performance Optimized**: 60fps with automatic cleanup

## 🚀 Quick Start

### Prerequisites
- Node.js (for local development server)
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yksanjo/Cursor-creature1.git
cd Cursor-creature1

# Install dependencies (optional, for http-server)
npm install

# Start the development server
npm start
```

Or use any HTTP server:
```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open `http://localhost:8080` in your browser.

## 📁 Project Structure

```
Cursor-creature1/
├── index.html              # Main HTML file
├── style.css               # Styling and layout
├── script.js               # WebGL initialization and controls
├── animation-demo.js       # Animation demos
├── shaders/
│   ├── vertexShader.glsl   # Vertex shader
│   └── fragmentShader.glsl # Fragment shader (the magic!)
├── animation/              # Animation system library
│   ├── Easing.js           # 30+ easing functions
│   ├── Tween.js            # Individual animations
│   ├── Timeline.js         # Animation sequencing
│   └── AnimationManager.js # Centralized animation loop
├── utils/                  # Utility functions
├── research/               # Learning resources
└── README.md              # This file
```

## 🎨 The Creature

The "Cursor Creature" is a living, breathing visual entity made of:
- **3 Central Rings**: The main body, rotating with colorful gradients
- **2 Orbiting Rings**: Additional rings that orbit around the center
- **Starfield**: A cosmic backdrop of twinkling stars
- **Nebula Clouds**: Subtle purple/blue clouds in the background

All controlled in real-time through interactive sliders!

## 🎮 Usage

1. **Adjust Controls**: Use the sliders to modify the creature's appearance
2. **Try Animations**: Click the demo buttons to see pre-built animations
3. **Experiment**: Combine different settings to create unique effects
4. **Copy Shader**: Use the "Copy" button to get the GLSL code

## 🛠️ Technologies

- **Three.js** (r128): WebGL rendering
- **GLSL**: OpenGL Shading Language for shaders
- **WebGL**: Hardware-accelerated graphics
- **ES6 Modules**: Modern JavaScript
- **Prism.js**: Syntax highlighting

## 📚 Learning Resources

This project includes research materials:
- **RESEARCH.md**: Guide to animation libraries
- **STUDY_PLAN.md**: 3-week learning path
- **QUICK_START_RESEARCH.md**: Quick reference
- **research/**: The Book of Shaders examples

## 🎓 Techniques Learned

- Distance fields (SDF) for smooth shapes
- Smoothstep and easing functions
- Noise functions for organic effects
- Color palette functions
- Animation sequencing and timing
- Performance optimization

## 🌌 Genesis

This project was born from exploring advanced JavaScript animation techniques and WebGL shader programming. The "Cursor Creature" represents the creative potential of combining:
- AI-assisted development (Cursor)
- Creative coding principles
- Advanced shader techniques
- Interactive design

## 📝 License

MIT License - feel free to use, modify, and create your own creatures!

## 🤝 Contributing

Feel free to fork, experiment, and create variations of the creature!

## 💡 Tips

- Try different ring counts to see how the creature evolves
- Adjust color shift for mesmerizing color transitions
- Increase animation speed for energetic movement
- Experiment with glow intensity for different moods

---

**Created with Cursor AI** 🚀

**Watch the creature come to life!** ✨
