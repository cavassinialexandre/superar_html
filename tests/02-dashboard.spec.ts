import { test, expect } from '@playwright/test'
import { selectUnit, screenshot } from './helpers'

test.describe('02 - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
  })

  test('exibe hero banner e KPIs', async ({ page }) => {
    await expect(page.locator('text=Portal Executivo')).toBeVisible()
    await expect(page.locator('text=Total de Grupos')).toBeVisible()
    await expect(page.locator('text=Nota Media')).toBeVisible()
    await screenshot(page, '02-dashboard-full')
  })

  test('exibe graficos', async ({ page }) => {
    await expect(page.locator('text=Evolucao das Notas')).toBeVisible()
    await expect(page.locator('text=Grupos por Tipo')).toBeVisible()
    await screenshot(page, '02-dashboard-charts')
  })

  test('exibe tabelas', async ({ page }) => {
    await expect(page.locator('text=Proximos a Avancar')).toBeVisible()
    await screenshot(page, '02-dashboard-tables')
  })
})
