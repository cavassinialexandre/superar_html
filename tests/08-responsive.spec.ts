import { test } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('08 - Responsividade', () => {
  test('mobile 375px - unit selection', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForTimeout(1000)
    await screenshot(page, '08-mobile-unit')
  })

  test('mobile 375px - dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await selectUnit(page, 'puma')
    await screenshot(page, '08-mobile-dashboard')
  })

  test('tablet 768px - dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await selectUnit(page, 'puma')
    await screenshot(page, '08-tablet-dashboard')
  })

  test('desktop 1440px - dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await selectUnit(page, 'puma')
    await screenshot(page, '08-desktop-dashboard')
  })

  test('desktop 1440px - groups', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await selectUnit(page, 'puma')
    await navigateVia(page, '/groups')
    await screenshot(page, '08-desktop-groups')
  })

  test('desktop 1440px - admin', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await selectUnit(page, 'puma')
    await navigateVia(page, '/admin')
    await screenshot(page, '08-desktop-admin')
  })
})
