/**
 * Animation Demo
 * Demonstrates the animation system with shader uniforms
 */

import { animate, timeline, getAnimationManager } from './animation/index.js';

export class AnimationDemo {
    constructor(uniforms) {
        this.uniforms = uniforms;
        this.manager = getAnimationManager();
    }

    /**
     * Demo 1: Animate ring radius with bounce
     */
    demoBounceRadius() {
        animate(
            this.uniforms.u_radius,
            'value',
            0.9,
            1500,
            'easeOutBounce',
            () => {
                // Bounce back
                animate(
                    this.uniforms.u_radius,
                    'value',
                    0.5,
                    1000,
                    'easeInBounce'
                );
            }
        );
    }

    /**
     * Demo 2: Color shift animation
     */
    demoColorShift() {
        animate(
            this.uniforms.u_color_shift,
            'value',
            10,
            3000,
            'easeInOutSine',
            () => {
                animate(
                    this.uniforms.u_color_shift,
                    'value',
                    0,
                    3000,
                    'easeInOutSine'
                );
            }
        );
    }

    /**
     * Demo 3: Complex timeline with multiple properties
     */
    demoTimeline() {
        const tl = timeline();

        tl.to({
            target: this.uniforms.u_radius,
            property: 'value',
            from: this.uniforms.u_radius.value,
            to: 0.8,
            duration: 1000,
            easing: 'easeOutQuad'
        })
        .to({
            target: this.uniforms.u_glow_intensity,
            property: 'value',
            from: this.uniforms.u_glow_intensity.value,
            to: 20,
            duration: 800,
            delay: 200,
            easing: 'easeInOutSine'
        })
        .to({
            target: this.uniforms.u_color_shift,
            property: 'value',
            from: this.uniforms.u_color_shift.value,
            to: 5,
            duration: 1500,
            delay: 300,
            easing: 'easeInOutElastic'
        })
        .to({
            target: this.uniforms.u_ring_count,
            property: 'value',
            from: this.uniforms.u_ring_count.value,
            to: 5,
            duration: 1000,
            delay: 500,
            easing: 'easeOutBack'
        })
        .onComplete(() => {
            console.log('Timeline animation complete!');
        });

        tl.play();
        this.manager.addTimeline(tl);
    }

    /**
     * Demo 4: Parallel animations
     */
    demoParallel() {
        const tl = timeline();

        tl.parallel([
            {
                target: this.uniforms.u_radius,
                property: 'value',
                from: this.uniforms.u_radius.value,
                to: 0.7,
                duration: 2000,
                easing: 'easeInOutSine'
            },
            {
                target: this.uniforms.u_speed,
                property: 'value',
                from: this.uniforms.u_speed.value,
                to: 1.5,
                duration: 2000,
                easing: 'easeInOutSine'
            },
            {
                target: this.uniforms.u_noise_amount,
                property: 'value',
                from: this.uniforms.u_noise_amount.value,
                to: 1.5,
                duration: 2000,
                easing: 'easeInOutSine'
            }
        ]);

        tl.play();
        this.manager.addTimeline(tl);
    }

    /**
     * Demo 5: Elastic pulse
     */
    demoElasticPulse() {
        const pulse = () => {
            animate(
                this.uniforms.u_glow_intensity,
                'value',
                25,
                800,
                'easeOutElastic',
                () => {
                    animate(
                        this.uniforms.u_glow_intensity,
                        'value',
                        10,
                        600,
                        'easeInElastic',
                        () => {
                            // Repeat
                            setTimeout(pulse, 500);
                        }
                    );
                }
            );
        };
        pulse();
    }

    /**
     * Demo 6: Continuous rotation speed variation
     */
    demoSpeedVariation() {
        const varySpeed = () => {
            animate(
                this.uniforms.u_speed,
                'value',
                2.0,
                2000,
                'easeInOutSine',
                () => {
                    animate(
                        this.uniforms.u_speed,
                        'value',
                        0.3,
                        2000,
                        'easeInOutSine',
                        () => {
                            varySpeed(); // Loop
                        }
                    );
                }
            );
        };
        varySpeed();
    }
}

export default AnimationDemo;

