import { test, expect } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('06 - Historico', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/history')
  })

  test('exibe tabela de avaliacoes', async ({ page }) => {
    await expect(page.locator('text=5 avaliacoes encontradas')).toBeVisible()
    await screenshot(page, '06-history-table')
  })

  test('filtros completos visiveis', async ({ page }) => {
    await expect(page.locator('text=Data Inicial')).toBeVisible()
    await expect(page.locator('text=Data Final')).toBeVisible()
    await expect(page.locator('text=Limpar filtros')).toBeVisible()
    await screenshot(page, '06-history-filters')
  })

  test('filtro por tipo funciona', async ({ page }) => {
    const selects = page.locator('select')
    await selects.first().selectOption('followup')
    await page.waitForTimeout(300)
    await expect(page.locator('text=1 avaliacoes encontradas')).toBeVisible()
    await screenshot(page, '06-history-filter-followup')
  })

  test('abrir detalhe de avaliacao', async ({ page }) => {
    await page.locator('tbody tr').first().locator('button').click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Detalhe da Avaliacao')).toBeVisible()
    await screenshot(page, '06-history-detail')
  })
})
