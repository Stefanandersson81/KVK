import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Kodsystem area.
 */
export class KodsystemPage extends BasePage {
  protected readonly defaultPath = '/';

  private readonly navMenu: Locator;
  private readonly aktivSummering: Locator;
  private readonly aktivCheckbox: Locator;
  private readonly utkastCheckbox: Locator;
  private readonly kodverkskallan: Locator;
  private readonly ingenStatusText: Locator;
  private lastAktivSummeringCount: number | null = null;

  constructor(page: Page) {
    super(page);
    this.navMenu = this.page.locator('[data-test-id="nav-menu"] [data-test-id="MENU_KODVERK"]');
    this.aktivSummering = this.page.locator('.aktiv-summering');
    this.aktivCheckbox = this.page.locator('#aktivCheckbox');
    this.utkastCheckbox = this.page.locator('label[for="checkbox_utkastCheckbox"]');
    this.kodverkskallan = this.page.getByText('Kodverkskällan', { exact: true });
    this.ingenStatusText = this.page.getByText('Ingen status har valts');
  }

  protected async waitForReady(): Promise<void> {
    await expect(this.navMenu).toBeVisible();
  }

  async openKodsystem(): Promise<void> {
    await this.open();
    await this.waitForReady();
    await this.navMenu.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyFilterStart(linkName = 'Kodsystem'): Promise<void> {
    await this.page.getByRole('link', { name: linkName }).click();
    await this.page.waitForTimeout(1000);

    const initialCount = await this.readCount('initial');
    await this.kodverkskallan.click();
    await this.page.waitForTimeout(1000);

    const filteredCount = await this.readCount('after source filter');
    expect(filteredCount).toBeLessThan(initialCount);

    await this.kodverkskallan.click();
    await this.page.waitForTimeout(1000);

    const beforeCheckbox = await this.readCount('before aktiv checkbox');
    await this.aktivCheckbox.click();
    await this.page.waitForTimeout(1000);

    const afterCheckbox = await this.readCount('after aktiv checkbox');
    expect(afterCheckbox).toBeLessThan(beforeCheckbox);

    await this.utkastCheckbox.click();
    await this.page.waitForTimeout(1000);

    await expect(this.ingenStatusText).toBeVisible();
    await this.aktivCheckbox.click();
    await this.page.waitForTimeout(3000);
  }

  private async readCount(label = 'aktiv-summering'): Promise<number> {
    const text = await this.aktivSummering.innerText();
    const match = text.match(/\d+/);
    const count = match ? parseInt(match[0], 10) : 0;

    if (this.lastAktivSummeringCount === null || this.lastAktivSummeringCount !== count) {
      const from = this.lastAktivSummeringCount === null ? 'none' : this.lastAktivSummeringCount;
      console.log(`[${label}] count changed: ${from} -> ${count}`);
      this.lastAktivSummeringCount = count;
    }

    return count;
  }
}
