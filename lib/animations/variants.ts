/**
 * Reusable animation variants for consistent micro-interactions
 * Using react-spring compatible configurations
 */

import { useSpring, config } from "@react-spring/web"

/**
 * Fade in animation
 */
export function useFadeIn(delay: number = 0) {
  return useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
    config: config.gentle,
  })
}

/**
 * Slide up animation
 */
export function useSlideUp(delay: number = 0) {
  return useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay,
    config: config.gentle,
  })
}

/**
 * Slide down animation
 */
export function useSlideDown(delay: number = 0) {
  return useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay,
    config: config.gentle,
  })
}

/**
 * Scale in animation
 */
export function useScaleIn(delay: number = 0) {
  return useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay,
    config: config.gentle,
  })
}

/**
 * Bounce animation for success states
 */
export function useBounce(trigger: boolean) {
  return useSpring({
    transform: trigger ? 'scale(1.1)' : 'scale(1)',
    config: config.wobbly,
  })
}

/**
 * Shake animation for errors
 */
export function useShake(trigger: boolean) {
  return useSpring({
    transform: trigger
      ? 'translateX(0px)'
      : 'translateX(0px)',
    from: { transform: trigger ? 'translateX(-10px)' : 'translateX(0px)' },
    config: { tension: 300, friction: 10 },
  })
}

/**
 * Pulse animation for loading states
 */
export function usePulse(isActive: boolean) {
  return useSpring({
    loop: isActive,
    from: { opacity: 1 },
    to: { opacity: 0.5 },
    config: { duration: 1000 },
  })
}

/**
 * Hover lift effect
 */
export function useHoverLift(isHovered: boolean) {
  return useSpring({
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    boxShadow: isHovered
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    config: config.wobbly,
  })
}

/**
 * Stagger children animation
 */
export function useStagger(index: number, total: number) {
  const delay = (index / total) * 200 // Stagger by 200ms total
  return useSlideUp(delay)
}

/**
 * Success checkmark animation
 */
export function useSuccessCheck(isVisible: boolean) {
  return useSpring({
    from: { strokeDashoffset: 100, opacity: 0 },
    to: {
      strokeDashoffset: isVisible ? 0 : 100,
      opacity: isVisible ? 1 : 0,
    },
    config: config.slow,
  })
}

/**
 * Loading spinner rotation
 */
export function useSpinAnimation(isSpinning: boolean) {
  return useSpring({
    loop: isSpinning,
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: 1000 },
  })
}

/**
 * Number counter animation
 */
export function useCountUp(end: number, duration: number = 1000) {
  return useSpring({
    from: { value: 0 },
    to: { value: end },
    config: { duration },
  })
}

/**
 * Progress bar animation
 */
export function useProgressBar(progress: number) {
  return useSpring({
    width: `${progress}%`,
    config: config.slow,
  })
}
