import puppeteer, { Browser, Page } from 'puppeteer';

export class ScrappingService {
  private browser: Browser;
  private page: Page;

  constructor(asyncParam: { browser: Browser; page: Page }) {
    if (typeof asyncParam === 'undefined') {
      throw new Error('Can not be called directly');
    }
    this.browser = asyncParam.browser;
    this.page = asyncParam.page;
  }

  /**
   trying to follow builder patter in here
   *ref:  https://stackoverflow.com/questions/43431550/async-await-class-constructor
   */
  static async build() {
    const browser: Browser = await puppeteer.launch({
      headless: false,
    });

    const page: Page = await browser.newPage();

    return new ScrappingService({ browser, page });
  }

  async login(url: string, username: string, password: string) {
    await this.page.goto(url);

    await this.page.type('#username', username);
    await this.page.type('#password', password);

    //It turns out the page.waitForNavigation() was failing for the race condition. Further research needed
    //ref: https://github.com/puppeteer/puppeteer/issues/3338
    const navigationPromise = this.page.waitForNavigation();
    await this.page.click('#LoginWidgetSubmitButton');
    await navigationPromise;
  }
}
