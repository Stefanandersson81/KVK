import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import path from 'path';
/**
 * Page object focused on flows for active kodsystem.
 * Currently only provides navigation scaffolding; add concrete interactions as selectors become known.
 */
export class AktivKodsystemPage extends BasePage {
  protected readonly defaultPath = '/';

  private readonly kodsystemLink: Locator;

  constructor(page: Page) {
    super(page);
    this.kodsystemLink = this.page.getByRole('link', { name: 'Kodsystem' });
  }

  protected async waitForReady(): Promise<void> {
    // Intentionally left blank; add a locator check when available.
  }

  /**
   * Open Kodsystem from the main menu.
   */
  async openKodsystem(): Promise<void> {
    //await this.open();
    await this.waitForReady();
    await this.kodsystemLink.click();
    await this.page.waitForTimeout(500);
    const firstRow = this.page.locator('tbody tr').first();
    await this.page.waitForTimeout(1000);
    await this.page.locator('[data-test-id="test-input"]').fill('ASA-klasser');
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Sök' }).click();
    await this.page.waitForTimeout(3000);
    await expect(firstRow).toContainText(/ASA-klasser/i);
    this.page.locator('tr', { hasText: 'Aktiv' }).click();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Redigera kodsystem' }).click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Placeholder flow for creating a draft from an existing active system.
   * Replace console logs with concrete UI actions once selectors are defined.
   */
  async createDraftFromActiveSystem(systemName: string): Promise<void> {
    await this.openKodsystem();
    console.log(`[aktivKodsystem] create draft from active system: ${systemName}`);
  }

  /**
   * Placeholder flow for adding codes to the draft.
   */
  async addCodesToDraft(codes: string[]): Promise<void> {
    await this.waitForReady();
    await this.page.getByRole('button', { name: 'Skapa kod' }).click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByRole('heading')).toContainText('Skapa kod');
    await expect(this.page.locator('#content')).toContainText('Kodsystem');
    await expect(this.page.locator('#content')).toContainText('Kod*');
    await expect(this.page.locator('#content')).toContainText('Term*');
    await expect(this.page.locator('#content')).toContainText('Synonym');
    await expect(this.page.locator('#content')).toContainText('Synonym i plural');
    await expect(this.page.locator('#content')).toContainText('Förkortning');
    await expect(this.page.locator('#content')).toContainText('Kommentarer');
    await expect(this.page.getByRole('button', { name: 'Avbryt' })).toBeVisible();
    await expect(this.page.locator('#content')).toContainText('Koden som nu skapas kan läggas till i värdemängder och kodrelationer när kodsystemsversionen blivit aktiv.');
    await this.page.locator('[data-test-id="test-input"]').nth(0).fill('123456789');
    await this.page.locator('[data-test-id="test-input"]').nth(1).fill('kod för system');
    await this.page.locator('[data-test-id="test-input"]').nth(2).fill('Synonym');
    await this.page.locator('[data-test-id="test-input"]').nth(3).fill('Synonym i plural');
    await this.page.locator('[data-test-id="test-input"]').nth(4).fill('Förkortning');
    await this.page.locator('[data-test-id="test-textarea"]').fill('Kommentar för test av att Skapa KOD');
    await expect(this.page.locator('#content')).toContainText('Lägg till');
    await this.page.getByRole('button', { name: 'Lägg till' }).click();
    await this.page.waitForTimeout(2000);
  }

  async addCodesWithCSVToDraft(codes: string[] = []): Promise<void> {
    await this.waitForReady();
    const importButton = this.page.getByRole('button', { name: 'Importera koder från fil' });
    const fileInput = this.page.locator('[data-test-id="input-test"]');
    const csvPath = path.join(process.cwd(), 'fixtures', 'test.csv');

    // Ensure we are in edit mode.
    if (await this.page.getByRole('button', { name: 'Redigera kodsystem' }).isVisible()) {
      await this.page.getByRole('button', { name: 'Redigera kodsystem' }).click();
      await this.page.waitForTimeout(2000);
    }
    // If disabled, it should become enabled after file selection.
    await fileInput.setInputFiles(csvPath);
    await this.page.waitForTimeout(500);

    if (await importButton.isDisabled({ timeout: 2000 }).catch(() => false)) {
      await expect(importButton).toBeEnabled();
    }

    await importButton.click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Ja' }).click();
    await this.page.waitForTimeout(3000);
  }

  async verifyCodesAdded(): Promise<void> {
    await this.waitForReady();
    await expect(this.page.locator('[data-test-id=\"app-table-body\"]')).toContainText(/123456789/i);
    await expect(this.page.locator('[data-test-id=\"app-table-body\"]')).toContainText(/Ny/i);
    await expect(this.page.locator('[data-test-id=\"app-table-body\"]')).toContainText(/enKodSomHärskarÖverAlla/i);
    
  }
  async redigeraVersionnummer(): Promise<void> {
    await this.waitForReady();
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Redigera information om kodsystem' }).click();
    await this.page.waitForTimeout(2000);
    await this.page.locator('[data-test-id="test-input"]').nth(1).fill('Version 1.0.1');
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Vidare' }).click();
    await this.page.waitForTimeout(2000);
  }

  async saveDraft(): Promise<void> {
    await this.waitForReady();
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Spara' }).click();
    await this.page.waitForTimeout(2000);
    const dialogText = this.page.getByText('Vill du spara följande ändringar och skapa ett kodsystemsutkast?', { exact: true });
    await expect(dialogText).toBeVisible();

    
  }


async verifySaveDraft(): Promise<void> {
    await this.waitForReady();
    const cells = this.page.locator('[data-test-id="app-table-cell"]');
        const expectedValues = ['kod1', 'kod4', 'enKodSomHärskarÖverAlla',];
        for (let value of expectedValues) {
            const matchingCells = cells.filter({ hasText: value });
            const count = await matchingCells.count();
            expect(count).toBeGreaterThan(0);
        }
  }
async verifyCodesAddedInTotal(): Promise<void> {
    await this.waitForReady();
    const cells = this.page.locator('[data-test-id="app-table-cell"]');
        const expectedValues = ['123456789', 'enKodSomHärskarÖverAlla',];
        for (let value of expectedValues) {
            const matchingCells = cells.filter({ hasText: value });
            const count = await matchingCells.count();
            expect(count).toBeGreaterThan(0);
        }
  } 

}
