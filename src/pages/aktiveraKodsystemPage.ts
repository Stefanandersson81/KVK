import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for activating a kodsystem draft.
 * Mirrors the locator pattern used in other page objects for consistency.
 */
export class AktiveraKodsystemPage extends BasePage {
  protected readonly defaultPath = '/';

  private readonly kodsystemLink: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly tableRows: Locator;
  private readonly activateButton: Locator;
  private readonly dateInput: Locator;
  private readonly saveButton: Locator;
  private readonly confirmHeading: Locator;
  private readonly confirmYesButton: Locator;
  private readonly aktivCheckbox: Locator;
  private readonly startTimeCells: Locator;

  constructor(page: Page) {
    super(page);
    this.kodsystemLink = this.page.getByRole('link', { name: 'Kodsystem' });
    this.searchInput = this.page.locator('[data-test-id="test-input"]').first();
    this.searchButton = this.page.locator('[data-test-id="app-button"]', { hasText: 'Sök' });
    this.tableRows = this.page.locator('tbody tr');
    this.activateButton = this.page.locator('[data-test-id="app-button"]', { hasText: 'Aktivera' });
    this.dateInput = this.page.locator('[data-test-id="test-date"]');
    this.saveButton = this.page.locator('[data-test-id="app-button"]', { hasText: 'Spara' });
    this.confirmHeading = this.page.getByRole('heading', { name: 'Vill du spara?' });
    this.confirmYesButton = this.page.getByRole('button', { name: /^Ja$/ });
    this.aktivCheckbox = this.page.locator('#aktivCheckbox');
    this.startTimeCells = this.page.locator('.content.starttid');
  }

  protected async waitForReady(): Promise<void> {
    await expect(this.kodsystemLink).toBeVisible();
  }

  /**
   * Search for a kodsystem draft and activate it for the next day.
   */
  async activateDraft(kodsystemName = 'ASA-klasser'): Promise<void> {

    await this.fillActivationDateForTomorrow();
    await this.saveAndConfirm();
  }

  private async fillActivationDateForTomorrow(): Promise<void> {
    const formatYMDLocal = (d: Date, timeZone = 'Europe/Stockholm') => {
      const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(d);
      const get = (t: string) => parts.find((p) => p.type === t)!.value;
      return `${get('year')}-${get('month')}-${get('day')}`;
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatYMDLocal(tomorrow);

    await expect(this.dateInput).toBeVisible();
    await this.dateInput.fill(tomorrowStr);
  }

  private async saveAndConfirm(): Promise<void> {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
    await expect(this.page.locator('#modalheader')).toContainText(' Vill du spara?');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Vill du spara aktiveringsdatum?Samtliga utkast på sidan kommer att aktiveras automatiskt på angivet datum kl. 00.00. Aktivering sker vid dygnets början. För att därefter kunna redigera, måste aktiveringsdatum först tas bort.JaNej');
    await expect(this.confirmHeading).toBeVisible();
    await this.confirmYesButton.click();
    await this.page.waitForTimeout(2000);
  }

  async valideraAttDatumFinnsPåAktiveradeUtkast(): Promise<void> {
    this.page.getByRole('link', { name: 'Kodsystem', exact: true }).click();
    await this.page.waitForTimeout(1500);

    await this.aktivCheckbox.click();
    await this.page.waitForTimeout(2000);

    const expectedDateTime = this.formatLocalDateForTomorrow();
    const matches = this.startTimeCells.filter({ hasText: expectedDateTime });
    const count = await matches.count();

    let matchCount = 0;
    for (let i = 0; i < count; i += 1) {
      const node = matches.nth(i);
      const text = (await node.innerText()).replace(/[“”"']/g, '').replace(/\s+/g, ' ').trim();

      if (text === expectedDateTime) {
        matchCount += 1;
        await expect(node).toHaveText(new RegExp(`\"?${expectedDateTime}\"?`));
      }
    }

    expect(matchCount).toBeGreaterThan(0);
  }

  private formatLocalDateForTomorrow(timeZone = 'Europe/Stockholm'): string {
    const formatYMDLocal = (d: Date) => {
      const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(d);
      const get = (t: string) => parts.find((p) => p.type === t)!.value;
      return `${get('year')}-${get('month')}-${get('day')}`;
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = formatYMDLocal(tomorrow);
    return `${formattedDate} 00:00`;
  }

}
