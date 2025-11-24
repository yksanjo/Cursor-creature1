# Advanced Animation System

A comprehensive animation system inspired by GSAP, Anime.js, and p5.js, implementing best practices for performance and sequencing.

## Features

### ✅ Easing Functions (30+ types)
- Linear, Quadratic, Cubic, Quartic, Quintic
- Sine, Exponential, Circular
- Back (overshoot), Elastic, Bounce
- All with In, Out, and InOut variants

### ✅ Tween System
- Individual property animations
- Custom easing functions
- Update and completion callbacks
- Play, pause, stop controls

### ✅ Timeline System
- Sequence multiple animations
- Parallel execution
- Delays and timing control
- Complex animation orchestration

### ✅ Animation Manager
- Centralized requestAnimationFrame loop
- Automatic cleanup of completed animations
- Performance monitoring (FPS, frame time)
- Optimized for 60fps

## Usage Examples

### Simple Animation

```javascript
import { animate } from './animation/index.js';

const obj = { x: 0, y: 0 };

// Animate x from current value to 100 over 1 second
animate(obj, 'x', 100, 1000, 'easeOutQuad', () => {
    console.log('Animation complete!');
});
```

### Tween with Custom Easing

```javascript
import { Tween, getAnimationManager } from './animation/index.js';

const tween = new Tween(
    myObject,           // target
    'opacity',          // property
    0,                  // from
    1,                  // to
    2000,               // duration (ms)
    'easeInOutElastic', // easing
    (value) => {        // onUpdate
        console.log('Current value:', value);
    },
    () => {             // onComplete
        console.log('Done!');
    }
);

tween.play();
getAnimationManager().addTween(tween);
```

### Timeline with Sequencing

```javascript
import { timeline } from './animation/index.js';

const tl = timeline();

tl.to({
    target: element1,
    property: 'x',
    from: 0,
    to: 100,
    duration: 1000,
    easing: 'easeOutQuad'
})
.to({
    target: element2,
    property: 'y',
    from: 0,
    to: 200,
    duration: 500,
    delay: 200,  // Start 200ms after previous
    easing: 'easeInBack'
})
.delay(500)  // Wait 500ms
.to({
    target: element3,
    property: 'opacity',
    from: 0,
    to: 1,
    duration: 300,
    easing: 'easeOutSine'
})
.onComplete(() => {
    console.log('Timeline complete!');
});

tl.play();
getAnimationManager().addTimeline(tl);
```

### Parallel Animations

```javascript
import { timeline } from './animation/index.js';

const tl = timeline();

tl.parallel([
    {
        target: obj1,
        property: 'x',
        from: 0,
        to: 100,
        duration: 1000
    },
    {
        target: obj2,
        property: 'y',
        from: 0,
        to: 100,
        duration: 1000
    },
    {
        target: obj3,
        property: 'scale',
        from: 1,
        to: 2,
        duration: 1000
    }
]);

tl.play();
getAnimationManager().addTimeline(tl);
```

### Custom Animation Function

```javascript
import { getAnimationManager } from './animation/index.js';

const manager = getAnimationManager();

function myAnimation(currentTime, deltaTime) {
    // Your custom animation logic
    myObject.rotation += deltaTime * 0.001;
    
    // Return false to continue, true to stop
    if (myObject.rotation > Math.PI * 2) {
        return true; // Stop animation
    }
    return false;
}

manager.addAnimation(myAnimation);
```

### Performance Monitoring

```javascript
import { getAnimationManager } from './animation/index.js';

const manager = getAnimationManager();

// Get current FPS
const fps = manager.getFPS();
console.log('FPS:', fps);

// Access performance data
console.log('Frame time:', manager.performance.frameTime);
console.log('Average frame time:', manager.performance.averageFrameTime);
```

## Key Concepts

### requestAnimationFrame
- Automatically syncs with browser's repaint cycle
- Pauses when tab is hidden (saves resources)
- Typically runs at 60fps
- Better than setInterval/setTimeout for animations

### Easing Functions
- Control the acceleration/deceleration of animations
- Make animations feel more natural
- Essential for professional-looking animations

### Animation Sequencing
- Timeline allows complex choreography
- Sequential and parallel execution
- Precise timing control

### Performance Optimization
- Automatic cleanup of completed animations
- Single requestAnimationFrame loop
- Efficient update cycles
- Performance monitoring built-in

## Integration with Shader Visualizer

You can use this animation system to animate shader uniforms:

```javascript
import { animate, getAnimationManager } from './animation/index.js';

// Animate shader uniform
animate(
    uniforms.u_radius,  // target
    'value',            // property
    0.8,                // to value
    2000,               // duration
    'easeInOutSine',    // easing
    () => {
        // Animation complete
        console.log('Radius animation done');
    }
);

getAnimationManager().start();
```

## Best Practices

1. **Use easing functions** - Makes animations feel natural
2. **Clean up animations** - Manager does this automatically
3. **Monitor performance** - Check FPS if animations are slow
4. **Use timelines** - For complex sequences
5. **Batch updates** - Use parallel() for simultaneous animations

## Performance Tips

- The AnimationManager automatically stops when no animations are running
- Completed tweens are automatically removed
- Single requestAnimationFrame loop for all animations
- Efficient update cycles with minimal overhead

---

**Enjoy smooth, performant animations!** 🎨✨

