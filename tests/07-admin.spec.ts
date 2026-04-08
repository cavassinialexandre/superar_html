import { test, expect } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('07 - Administracao', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/admin')
  })

  test('exibe tabs e usuarios', async ({ page }) => {
    await expect(page.locator('text=Carlos Silva')).toBeVisible()
    await expect(page.locator('text=Ana Oliveira')).toBeVisible()
    await screenshot(page, '07-admin-users')
  })

  test('tab gerencias', async ({ page }) => {
    await page.locator('button:has-text("Gerencias")').click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=Gerencia de Producao')).toBeVisible()
    await screenshot(page, '07-admin-gerencias')
  })

  test('tab areas', async ({ page }) => {
    await page.locator('button:has-text("Areas")').click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=Linha de Montagem A')).toBeVisible()
    await screenshot(page, '07-admin-areas')
  })

  test('tab tipos de grupo', async ({ page }) => {
    await page.locator('button:has-text("Tipos de Grupo")').click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=Operacional').first()).toBeVisible()
    await screenshot(page, '07-admin-types')
  })

  test('tab checklists', async ({ page }) => {
    await page.locator('button:has-text("Checklists")').click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=Checklist Operacional Passo 1')).toBeVisible()
    await screenshot(page, '07-admin-checklists')
  })

  test('busca funciona', async ({ page }) => {
    await page.fill('input[placeholder="Buscar usuario..."]', 'Carlos')
    await page.waitForTimeout(300)
    await expect(page.locator('text=Carlos Silva')).toBeVisible()
    await screenshot(page, '07-admin-search')
  })
})
