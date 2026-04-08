import type { Variants } from 'framer-motion'

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.015, transition: { duration: 0.25, ease: 'easeOut' } },
  tap: { scale: 0.985 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
}

export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}
