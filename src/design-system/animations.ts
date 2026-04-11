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

// ---------------------------------------------------------------------------
// Evaluation page premium animations
// ---------------------------------------------------------------------------

export const evalStaggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const evalSectionStagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
}

export const evalQuestionItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

export const evalGlassCard: Variants = {
  initial: { opacity: 0, scale: 0.95, x: 20 },
  animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] } },
}

// Band header entrance (slide-in from left)
export const bandEntrance: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// Timeline node entrance (pop-in)
export const timelineNodeEntrance: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}

// Timeline line draw
export const timelineLineDraw: Variants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

// Stepper circle entrance (staggered pop)
export const stepperCircleEntrance: Variants = {
  initial: { opacity: 0, scale: 0, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}

// Stepper line draw (horizontal)
export const stepperLineDraw: Variants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

// Stepper stagger container
export const stepperStagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}
