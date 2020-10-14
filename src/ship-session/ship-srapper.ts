import * as shortid from 'shortid';
import solveCaptcha from './trucaptchasolver';
import { Browser, Page } from 'puppeteer';

/**
 * Ref: https://github.com/puppeteer/puppeteer/issues/6214
 */
declare module 'puppeteer' {
  export interface Page {
    waitForTimeout(duration: number): Promise<void>;
  }
}
import * as puppeteer from 'puppeteer';
import { SeatCategory } from './seat-category.entity';
import { Ship } from './ship.entity'; //import puppeteer from 'puppeteer' does not work
import { uploadImage } from './image-uploader';

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
    try {
      const browser: Browser = await puppeteer.launch({
        headless: false,
      });

      const page: Page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      return new ScrappingService({ browser, page });
    } catch (e) {
      console.log('ERROR: ScrappingService.build: ', e);
    }
  }

  async screenshotDOMElement(selector) {
    const IMAGE_DIR = `${process.cwd()}/screenshots/`; //this is the image directory

    const padding = 0;
    const path = `${IMAGE_DIR}${shortid.generate()}.png`;

    if (!selector) throw Error('Please provide a selector.');

    const rect = await this.page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

    try {
      await this.page.screenshot({
        path,
        clip: {
          x: rect.left - padding,
          y: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        },
      });
    } catch (e) {
      console.log('Error taking screenshot', e);
    }

    return path;
  }

  async login(url: string, username: string, password: string) {
    await this.page.goto(url);

    await this.page.type('#username', username);
    await this.page.type('#password', password);

    const CAPTCHA_IMAGE_SELECTOR = '.captchaImg > img:nth-child(1)';
    const captchaImagePath = await this.screenshotDOMElement(
      CAPTCHA_IMAGE_SELECTOR,
    );
    //TODO: add failed captcha check here
    const captchaText = await solveCaptcha(captchaImagePath);
    await this.page.type('#retypecaptcha', captchaText);

    //It turns out the page.waitForNavigation() was failing for the race condition. Further research needed
    //ref: https://github.com/puppeteer/puppeteer/issues/3338
    const navigationPromise = this.page.waitForNavigation();
    await this.page.click('#LoginWidgetSubmitButton');
    await navigationPromise;
  }

  async fillUpRouteDepartureDateInfo(
    leavingFromOptionSelector: string,
    goingToOptionSelector: string,
    departureDate: string,
    viewSeatSelector: string,
  ) {
    const LEAVING_FROM_SELECTOR = '#searchmenu_leavingform.select';
    const GOING_TO_SELECTOR = '#searchmenu_goingto';
    const SEARCH_BUTTON_SELECTOR = '#searchmenu_submitbutton';
    const DATE_PICKER = '#searchmenu_departingon';

    //Removing the readonly attribute so that we can enter the date
    //ref: https://stackoverflow.com/questions/58507589/how-to-use-this-datepicker-with-puppeteer
    await this.page.focus(DATE_PICKER);
    await this.page.$eval(
      DATE_PICKER,
      (e: any, departureDate) => {
        e.removeAttribute('readonly'); //so that the date picker is editable
        e.value = departureDate; //filling out the date
      },
      departureDate,
    );

    //selecting the routes
    await this.page.select(LEAVING_FROM_SELECTOR, leavingFromOptionSelector);
    await this.page.select(GOING_TO_SELECTOR, goingToOptionSelector);

    await this.page.click(SEARCH_BUTTON_SELECTOR);

    await this.page.waitForTimeout(50);

    await this.page.click(viewSeatSelector);
  }

  async getAvailableSeatsAndLayOut(ship: Ship) {
    await this.page.waitForTimeout(50);

    const seatCategories: SeatCategory[] = await ship.seatCategories;

    await this.takeScreenshotSeatLayOut(seatCategories);
  }

  /**
   * Returns the uploaded image link
   * @param selector
   */
  private async takeScreenshotSeatLayOut(seatCategories: SeatCategory[]) {
    // const SEAT_LAYOUT_SELECTORS = ["#seatBlock_1", "#seatBlock_1","#seatBlock_1","#seatBlock_1","#seatBlock_1","#seatBlock_1"]

    // console.log("seatCategories:dd ",seatCategories);

    let seatCategoryImages = [];

    for await (const seatCategory of seatCategories) {
      await this.page.click(seatCategory.categoryButtonSelector);
      let imageScreenShotPath = await this.screenshotDOMElement(
        seatCategory.categoryLayOutSelector,
      );
      const url = await uploadImage(imageScreenShotPath);

      seatCategoryImages.push({
        url,
      });
    }
    console.log('Finally: ', seatCategoryImages);
  }

  async uploadScreenshot(path: string) {}

  async getAvailableSeats(selector: string) {}
}
