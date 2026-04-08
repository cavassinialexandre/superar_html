import { test, expect } from '@playwright/test'
import { selectUnit, navigateVia, screenshot } from './helpers'

test.describe('05 - Auditoria', () => {
  test.beforeEach(async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/evaluation/grp-1?type=audit')
  })

  test('exibe header com campos corretos', async ({ page }) => {
    await expect(page.locator('text=AUDITORIA')).toBeVisible()
    await expect(page.locator('text=Pessoas presentes')).toBeVisible()
    await expect(page.locator('text=Outras pessoas')).toBeVisible()
    await expect(page.locator('text=Meta:')).toBeVisible()
    await screenshot(page, '05-evaluation-header')
  })

  test('selecionar pessoas presentes', async ({ page }) => {
    await page.locator('button:has-text("Roberto Lima")').click()
    await page.locator('button:has-text("Fernanda Souza")').click()
    await page.waitForTimeout(300)
    await screenshot(page, '05-evaluation-people')
  })

  test('responder perguntas e ver progresso', async ({ page }) => {
    const questionCards = page.locator('.pl-3 >> button:has-text("Sim")')
    await questionCards.nth(0).click()
    await page.waitForTimeout(300)
    await screenshot(page, '05-evaluation-progress')
  })

  test('finalizar com todas Sim mostra advance dialog', async ({ page }) => {
    const simButtons = page.locator('.pl-3 >> button:has-text("Sim")')
    const count = await simButtons.count()
    for (let i = 0; i < count; i++) {
      await simButtons.nth(i).click()
      await page.waitForTimeout(80)
    }
    await page.waitForTimeout(300)
    await screenshot(page, '05-eval-all-answered')

    await page.locator('button:has-text("Finalizar Avaliacao")').click()
    await page.waitForTimeout(800)
    await expect(page.locator('text=Grupo Elegivel para Avanco')).toBeVisible()
    await screenshot(page, '05-eval-advance-dialog')
  })

  test('escolher avancar mostra resultado', async ({ page }) => {
    const simButtons = page.locator('.pl-3 >> button:has-text("Sim")')
    const count = await simButtons.count()
    for (let i = 0; i < count; i++) {
      await simButtons.nth(i).click()
      await page.waitForTimeout(50)
    }
    await page.locator('button:has-text("Finalizar Avaliacao")').click()
    await page.waitForTimeout(800)
    await page.locator('button:has-text("Avancar para proxima sequencia")').click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Avaliacao Finalizada')).toBeVisible()
    await expect(page.locator('text=Avancou para o passo')).toBeVisible()
    await screenshot(page, '05-eval-result-advanced')
  })
})

test.describe('05b - Follow-up', () => {
  test('follow-up nao mostra dialog de avanco', async ({ page }) => {
    await selectUnit(page, 'puma')
    await navigateVia(page, '/evaluation/grp-1?type=followup')
    await expect(page.locator('text=FOLLOW-UP')).toBeVisible()

    const simButtons = page.locator('.pl-3 >> button:has-text("Sim")')
    const count = await simButtons.count()
    for (let i = 0; i < count; i++) {
      await simButtons.nth(i).click()
      await page.waitForTimeout(50)
    }
    await page.locator('button:has-text("Finalizar Avaliacao")').click()
    await page.waitForTimeout(800)
    await expect(page.locator('text=Avaliacao Finalizada')).toBeVisible()
    await expect(page.locator('text=Grupo Elegivel para Avanco')).not.toBeVisible()
    await screenshot(page, '05b-followup-no-advance')
  })
})
