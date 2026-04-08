import { test, expect } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('04 - Detalhe do Grupo', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/groups/grp-1')
  })

  test('exibe info do grupo', async ({ page }) => {
    await expect(page.locator('h2:has-text("Equipe Alpha")')).toBeVisible()
    await expect(page.locator('text=Operacional').first()).toBeVisible()
    await screenshot(page, '04-group-detail')
  })

  test('exibe equipe com roles', async ({ page }) => {
    await expect(page.locator('text=Roberto Lima')).toBeVisible()
    await expect(page.locator('text=Facilitador')).toBeVisible()
    await screenshot(page, '04-group-team')
  })

  test('botoes de acao visiveis', async ({ page }) => {
    await expect(page.locator('button:has-text("Auditoria")')).toBeVisible()
    await expect(page.locator('button:has-text("Follow-up")')).toBeVisible()
  })
})
