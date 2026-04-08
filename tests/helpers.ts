import { Page } from '@playwright/test'

export async function selectUnit(page: Page, unit: 'puma' | 'monte-alegre' = 'puma') {
  // Set unit store directly in localStorage and navigate
  await page.goto('/')
  await page.evaluate((u) => {
    localStorage.setItem('kaizen-unit', JSON.stringify({ state: { selectedUnit: u }, version: 0 }))
    localStorage.setItem('kaizen-auth', JSON.stringify({
      state: { userName: 'Carlos Silva', userId: 'user-1', profiles: ['admin', 'evaluator'], isAuthenticated: true },
      version: 0
    }))
  }, unit)
  await page.goto('/#/dashboard')
  await page.waitForTimeout(2000)
}

export async function navigateVia(page: Page, path: string) {
  await page.goto(`/#${path}`)
  await page.waitForTimeout(1000)
}

export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: true })
}

export async function screenshotViewport(page: Page, name: string) {
  await page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: false })
}
