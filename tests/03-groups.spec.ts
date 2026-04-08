import { test, expect } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('03 - Lista de Grupos', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/groups')
  })

  test('exibe lista de grupos com cards', async ({ page }) => {
    await expect(page.locator('text=Equipe Alpha')).toBeVisible()
    await expect(page.locator('text=7 grupos encontrados')).toBeVisible()
    await screenshot(page, '03-groups-list')
  })

  test('filtro por busca funciona', async ({ page }) => {
    await page.fill('input[placeholder="Buscar grupo..."]', 'Alpha')
    await page.waitForTimeout(300)
    await expect(page.locator('text=1 grupos encontrados')).toBeVisible()
    await screenshot(page, '03-groups-search')
  })

  test('filtro por area funciona', async ({ page }) => {
    const selects = page.locator('select')
    await selects.nth(1).selectOption('area-1')
    await page.waitForTimeout(300)
    await expect(page.locator('text=1 grupos encontrados')).toBeVisible()
    await screenshot(page, '03-groups-filter-area')
  })
})
