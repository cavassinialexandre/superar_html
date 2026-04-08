import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

test.describe('01 - Selecao de Unidade', () => {
  test('exibe pagina de selecao com 2 unidades', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    await expect(page.locator('h1:has-text("Kaizen TPM")')).toBeVisible()
    await expect(page.locator('h2:has-text("Puma")')).toBeVisible()
    await expect(page.locator('h2:has-text("Monte Alegre")')).toBeVisible()
    await screenshot(page, '01-unit-selection-desktop')
  })

  test('hover mostra efeito no card', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    await page.locator('button:has-text("Puma")').first().hover()
    await page.waitForTimeout(300)
    await screenshot(page, '01-unit-selection-hover-puma')
  })

  test('selecionar unidade navega para dashboard', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    await page.locator('button:has-text("Puma")').first().click()
    await page.waitForTimeout(1500)
    await expect(page.locator('text=Portal Executivo')).toBeVisible()
  })

  test('responsivo mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForTimeout(1000)
    await screenshot(page, '01-unit-selection-mobile')
  })
})
