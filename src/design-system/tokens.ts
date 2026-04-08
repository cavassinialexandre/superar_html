export const colors = {
  primary: {
    50: '#E8F5F4',
    100: '#C5E8E6',
    200: '#96D4D0',
    300: '#63BDB7',
    400: '#3AA39C',
    500: '#1E7A73',
    600: '#155F59',
    700: '#104A46',
    800: '#103734',
    900: '#0C2B28',
    950: '#071D1B',
  },
  yellow: {
    50: '#FEFDE8',
    500: '#DDDD03',
    700: '#867F06',
  },
  rose: {
    50: '#FEF1F3',
    500: '#CE3C5A',
    600: '#B72E4A',
  },
  green: {
    50: '#ECFDF1',
    500: '#00A650',
    700: '#5EA448',
  },
  gray: {
    50: '#F8FAFA',
    100: '#F1F4F4',
    200: '#E4E8E8',
    300: '#CDD4D3',
    400: '#A3ADAC',
    500: '#7A8584',
    600: '#576160',
    700: '#3E4847',
    800: '#272F2E',
    900: '#151B1A',
  },
} as const

export const gradients = {
  sidebar: 'linear-gradient(180deg, #103734 0%, #0C2B28 100%)',
  hero: 'linear-gradient(135deg, #103734 0%, #155F59 50%, #1E7A73 100%)',
  progress: 'linear-gradient(90deg, #103734 0%, #1E7A73 40%, #00A650 75%, #5EA448 100%)',
  page: 'linear-gradient(180deg, #F8FAFA 0%, #F1F4F4 100%)',
  mesh: `radial-gradient(ellipse at 20% 50%, rgba(16, 55, 52, 0.05) 0%, transparent 50%),
         radial-gradient(ellipse at 80% 20%, rgba(0, 166, 80, 0.04) 0%, transparent 50%),
         radial-gradient(ellipse at 60% 80%, rgba(206, 60, 90, 0.03) 0%, transparent 50%),
         linear-gradient(180deg, #F8FAFA 0%, #F1F4F4 100%)`,
  primaryCard: 'linear-gradient(135deg, #103734 0%, #1a524e 100%)',
} as const

export function getScoreColor(score: number) {
  if (score >= 80) return colors.green[500]
  if (score >= 50) return colors.yellow[700]
  return colors.rose[500]
}

export function getScoreColorClass(score: number) {
  if (score >= 80) return 'text-green-500'
  if (score >= 50) return 'text-yellow-700'
  return 'text-rose-500'
}

export function getScoreBgClass(score: number) {
  if (score >= 80) return 'bg-green-50 text-green-600'
  if (score >= 50) return 'bg-yellow-50 text-yellow-700'
  return 'bg-rose-50 text-rose-600'
}
