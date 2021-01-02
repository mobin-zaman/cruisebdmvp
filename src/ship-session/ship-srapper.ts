import { nanoid } from 'nanoid';
import solveCaptcha from './trucaptchasolver';
import { Browser, Page } from 'puppeteer';
import convertFromHtmlToPdf from './html2pdf';
import * as fs from 'fs';
import * as path from 'path';
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
import { html2jsonExtractSeatInfo } from './html2json';

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
      const launchOptions = {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // <- this one doesn't works in Windows
          '--disable-gpu',
        ],
        headless: true,
      };
      const browser: Browser = await puppeteer.launch(launchOptions);
      /**
       * trying to optimize performane
        https://docs.browserless.io/blog/2019/05/03/improving-puppeteer-performance.html
       */

      const page: Page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      console.log('SCRAPPER : build finished');

      return new ScrappingService({ browser, page });
    } catch (e) {
      console.log('ERROR: ScrappingService.build: ', e);
    }
  }

  async screenshotDOMElement(selector) {
    // const IMAGE_DIR = `${process.cwd()}/screenshots/`; //this is the image directory
    const IMAGE_DIR = `/tmp/`;

    const padding = 0;
    const path = `${IMAGE_DIR}${nanoid()}.png`;

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

    try {
      const captchaText = await solveCaptcha(captchaImagePath);

      await this.page.type('#retypecaptcha', captchaText);

      //It turns out the page.waitForNavigation() was failing for the race condition. Further research needed
      //ref: https://github.com/puppeteer/puppeteer/issues/3338
      const navigationPromise = this.page.waitForNavigation();
      await this.page.click('#LoginWidgetSubmitButton');
      await navigationPromise;

      console.log('SCRAPPER: LOGIN DONE');
    } catch (e) {
      console.log('Error in scrapper.login: ', e);
    }
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
    await this.page.waitForSelector(DATE_PICKER);
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

    // await this.page.waitForTimeout(50);

    await this.page.click(viewSeatSelector);
    console.log('SCRAPPER: FILLING OUT DEPARTURE INFO DONE');
  }

  async getAvailableSeatsAndLayOut(ship: Ship) {
    // await this.page.waitForTimeout(50);

    const seatCategories: SeatCategory[] = await ship.seatCategories;

    const seatCategoryImages = await this.takeScreenshotSeatLayOut(
      seatCategories,
    );

    const SEAT_LAYOUT_INNERHTML_SELECTOR = '.overview';
    const availableSeats = await this.getAvailableSeats(
      SEAT_LAYOUT_INNERHTML_SELECTOR,
    );
    // console.log('availableSeats: ', availableSeats);
    console.log('length: ', availableSeats.length);

    return this.mergeAvailableSeatsAndLayOutImagesUrl(
      seatCategories,
      seatCategoryImages,
      availableSeats,
    );
  }

  private async mergeAvailableSeatsAndLayOutImagesUrl(
    seatCategories: SeatCategory[],
    seatCategoryImages,
    availableSeats,
  ) {
    const mergedSeatAndLayOutImagesUrl = [];

    //TODO:  optimize the performance here
    for (const seatCategory of seatCategories) {
      const resultantSeat = [];

      for (const availableSeat of availableSeats) {
        if (availableSeat.deck_title === seatCategory.categoryName) {
          resultantSeat.push({
            seatId: availableSeat.id,
            seatName: availableSeat.display_name,
            seatFare: availableSeat.seat_fare,
            seatTypeTitle: availableSeat.seat_type_title,
          });
        }
      }

      const seatLayoutImageUrl = seatCategoryImages.find(
        x => x.id === seatCategory.id,
      ).categorySeatLayoutImageUrl;

      // console.log('seatLayoutImageUrl: ', seatLayoutImageUrl);

      // const seatLayoutImageUrl =
      mergedSeatAndLayOutImagesUrl.push({
        seatCategoryId: seatCategory.id,
        seatCategoryName: seatCategory.categoryName,

        availableSeats: resultantSeat,
        seatLayoutUrl: seatLayoutImageUrl,
      });
    }
    console.log('SCRAPPER: taken available seat layouts');
    return mergedSeatAndLayOutImagesUrl;
  }

  /**
   * Returns the uploaded image link
   * @param selector
   */
  private async takeScreenshotSeatLayOut(seatCategories: SeatCategory[]) {
    const seatCategoryImages = [];

    //TODO: need to add documentation here
    for await (const seatCategory of seatCategories) {
      await this.page.click(seatCategory.categoryButtonSelector);

      const imageScreenShotPath = await this.screenshotDOMElement(
        seatCategory.categoryLayOutSelector,
      );

      const categorySeatLayoutImageUrl = await uploadImage(imageScreenShotPath);

      seatCategoryImages.push({
        id: seatCategory.id,
        categoryName: seatCategory.categoryName,
        categorySeatLayoutImageUrl,
      });
    }
    console.log('Finally: ', seatCategoryImages);
    return seatCategoryImages;
  }

  async bookSeats(
    seatIds: string[],
    categoryButtonSelector: string,
    categoryLayOutSelector: string,

    boardingPointSelector: string,
    boardingPointOption: string,

    droppingPointSelector: string,
    droppingPointOption: string,

    customerNameSelector: string,
    customerName: string,

    mobileNumberSelector: string,
    mobileNumber: string,

    purchaseButtonSelector: string,
  ) {
    //First take the seat information's form html2json api
    const availableSeats = await this.getAvailableSeats(categoryLayOutSelector);

    //Then verify if any of the seatIds is missing from availableSeat
    //if missing that means the seat is not available

    /**
     * Total price is going to provide the value to pass, in order to pass the total price to the controller
     */
    let totalPrice = 0;

    //!TODO: price will be found here, add the price and and send it to this.saveAndUploadTicket
    seatIds.forEach(seatId => {
      const seatFound = availableSeats.find(x => x.id === seatId);
      if (!seatFound) {
        throw new Error(`seatId: ${seatId} is not available`);
      } else totalPrice += parseInt(seatFound.seat_fare);
    });

    //now click the category button to make seats visible
    //so that puppeteer can interact

    await this.page.click(categoryButtonSelector);

    //after the validation now we are clicking the button needed for seats

    for (const seatId of seatIds) {
      const seatSelector = '#\\3' + seatId[0] + ' ' + seatId.substring(1);
      await this.page.click(seatSelector);
    }

    //now select the boarding point selector and option

    await this.page.select(boardingPointSelector, boardingPointOption);
    await this.page.select(droppingPointSelector, droppingPointOption);

    //and fill up the customer name and phone number

    // const customerNameSelector = "#buyer_name_3c3a9331c329e0d90398d19675e71f36";
    // const mobileNumberSelector = "#mobile_number_3c3a9331c329e0d90398d19675e71f36";

    await this.page.type(customerNameSelector, customerName);
    await this.page.type(mobileNumberSelector, mobileNumber);

    // return {
    //   okay: "done"
    // }

    await this.page.click(purchaseButtonSelector);

    // saveAndUploadTicket takes care of the conversion and returning the filePath of the ticket
    return await this.saveAndUploadTicket(totalPrice);
  }

  private async saveAndUploadTicket(
    totalPrice: number,
  ): Promise<{ ticketPath: string; price: number }> {
    const LASER_PRINTER_SELECTOR = '#laser_printer';
    // const PRINT_POP_UP_BUTTON = "#print_tkt";

    //wait for the ticket window to load

    await this.page.waitForSelector(LASER_PRINTER_SELECTOR);
    await this.page.click(LASER_PRINTER_SELECTOR);

    const TICKET_CONTENT_SELECTOR = '#print_content_laser';

    const ticketContentsHtml = await this.page.$eval(
      TICKET_CONTENT_SELECTOR,
      element => {
        return element.innerHTML;
      },
      TICKET_CONTENT_SELECTOR,
    );

    const pdfPath = await convertFromHtmlToPdf(ticketContentsHtml);

    return {
      ticketPath: path.basename(pdfPath), //it is supposed to return the file name only
      //!TODO: fix the price
      price: totalPrice,
    };
  }

  private async getAvailableSeats(selector) {
    // const selector = '.overview';
    const innerHtml = await this.page.$eval(
      selector,
      element => {
        return element.innerHTML;
      },
      selector,
    );

    const seats = await html2jsonExtractSeatInfo(innerHtml);

    return this.processSeatsJsonInfo(seats);
  }

  private processSeatsJsonInfo(seats) {
    //TODO: add example here

    // const availableSeats = seats.reduce((result, element) => {
    //   if(element.attr.status === 'available') {
    //     result.push(element);
    //     return result;
    //   }
    // }, []);

    const availableSeats = [];
    // console.log("Seats here: ", seats);
    // fs.writeFile("test.txt", JSON.stringify(seats), 'utf8' ,function(err) {
    //   if(err) {
    //     console.log(err);
    //   }
    // })
    for (const seat of seats) {
      if (
        // seat.attr.status === 'available' &&
        // seat.attr.title !== 'Not Avalable'
        seat.attr.class === 'tck_seat_hr_checkbox seat_unchecked'
      ) {
        if (seat.deck_title === 'Super Luxury Ac') {
          console.log('seat is here: ', seat);
        }
        availableSeats.push(seat.attr);
      }
    }

    return availableSeats;
  }

  async browserClose() {
    await this.browser.close();
    console.log('Browser is closed');
  }
}
