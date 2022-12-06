import { randomFromArray, randomNumber } from "./Common";
import bgStory from "../assets/images/sign/bg-story.png";

CanvasRenderingContext2D.prototype.roundRect = function (
  x,
  y,
  width,
  height,
  radius
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

class VideoStories {
  constructor() {
    this._app_id = null;
    this._app_name = "cookiesapp";
    this._width = null;
    this._height = null;
    this._bridge = null;
    this._uid = null;
    this._os = null;
    this._scale = null;

    this._translateButton = 0;
    this._backgroundType = "";
    this._backgroundBlob = "";
    this._fileType = "";

    this._baseFontSize = 0;
    this._fontSize = 0;

    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d");
    this._ctx.save();
  }

  /**
   * Инициализирует объект для дальнейшей работы
   * @param {number} app_id - id приложения VK
   * @param {*} bridge - VK Bridge
   * @param {number|string} uid - user id
   * @param {string} os - ось устройства (в iOS не нужно масштабировать)
   * @param {string=} type - game | app, ждля определения короткого имени в урл
   */
  init(app_id, bridge, uid, os, type) {
    if (this._init) return;

    this._app_id = app_id;
    this._bridge = bridge;
    this._uid = uid;
    this._os = os;

    if (type === "game") this._app_name = "cookiemerge";

    if (os === "iOS" || os === "Android") {
      this._scale = os === "iOS" ? 1 : window.devicePixelRatio;
      this._width = window.screen.width;
      this._height = window.screen.width * 1.78;
      this._translateButton = -0.125;
      this._baseFontSize = 12;
      this._backgroundType = "image";
      this._fileType = ".jpg";
    } else {
      this._scale = 1;
      this._width = 1080;
      this._height = 1920;
      this._translateButton = -0.138;
      this._baseFontSize = 36;
      this._backgroundType = "image";
      this._fileType = ".jpg";
    }

    this._init = true;
  }

  /**
   * Открывает редактор историй для предсказаний (без предсказания тип - special)
   * @param {string=} predict - текст предсказния
   * @param {string=} type - тип предсказания ( blue | dark-purple | light-blue | light-green | light-purple | orange | special),
   * без типа - случайное
   * @return {Promise< {success: boolean, response: object } >} Promise - результат работы с редактором историй
   */
  openPredictStoryBox(predict, type) {
    if (!this._init) return this._noInit();
    if (!predict) type = "special";
    let url = bgStory;

    this._translateButton =
      this._os === "iOS" || this._os === "Android" ? -0.125 : -0.138;

    return this._processing(url, predict, type);
  }

  /**
   * Открывает редактор историй для постинга нового уровня печеньки в мерджилке
   * @param {number} biggest - новый уровень печеньки
   * @returns {Promise< {success: boolean, response: object } >} Promise - результат работы с редактором историй
   */
  async openGameStoryBox(biggest) {
    if (!this._init) return this._noInit();

    let i,
      key,
      count,
      cookies = [],
      result = [];

    //страховка от бага
    if (biggest < 5 || isNaN(biggest)) biggest = 5;

    // собираем массив "уже доступных" печенек (0 до максимальной)
    for (i = 1; i < biggest; i++) cookies.push(i);

    // чтобы каждый шаг не пересчитывать новую длину
    count = cookies.length - 1;

    for (i = 0; i < 4; i++) {
      // получаем случайный индекс массива из доступных
      key = count ? randomNumber(0, count) : 0;

      // добавляем в результат
      result.push(
        await this._loadImage(
          "https://bottle.cookieapp.ru:4444/public/cookies/" +
            cookies[key] +
            ".png"
        )
      );

      // убираем печеньку из массива
      cookies.splice(key, 1);
      count--;
    }

    // ставим смещение кнопки (стикера) по вертикали
    this._translateButton =
      this._os === "iOS" || this._os === "Android" ? -0.052 : -0.057;

    // создаем новый фон (с печеньками)
    await this._createGameBgImage(biggest, result);

    // открываем редактор сторис
    return this._openStoryBox(
      this._backgroundBlob,
      this._createButton("merge-game")
    );
  }

  async _noInit() {
    return { success: false, response: { error: "Module not init" } };
  }

  _processing(url, predict, type) {
    this._fontSize = this._baseFontSize + 2 * ((this._width - 320) / 680);
    predict = type !== "special" ? this._createPredict(predict) : {};

    if (this._backgroundType === "image")
      return this._createBgImage(url, predict).then((blob) =>
        this._openStoryBox(blob, this._createButton(type))
      );

    return this._openStoryBox(url, this._createButton(type), predict);
  }

  /**
   * Создает изображение кнопки
   * @return { {width, height, blob} } - объект, сожержаий: ширину, высоту и изображение в base64
   * @private
   */
  _createButton(type) {
    const button = {};

    this._ctx.restore();

    button.width = this._width * 0.9 * this._scale;
    button.height = this._height * 0.083 * this._scale;

    this._canvas.width = button.width;
    this._canvas.height = button.height;

    switch (type) {
      case "special":
        const fz = this._fontSize * 2 * this._scale,
          y = (button.height / 2 + fz / 2) * 0.9,
          gradient = this._ctx.createLinearGradient(0, 0, button.width, 0);

        gradient.addColorStop(0, "#BC894C");
        gradient.addColorStop(0.24, "#EFCB84");

        this._ctx.roundRect(
          0,
          0,
          button.width,
          button.height,
          (button.height / 2) * this._scale
        );
        this._ctx.fillStyle = gradient;
        this._ctx.fill();

        this._ctx.font = `bold ${fz}px Gotham Pro`;
        this._ctx.textAlign = "center";
        this._ctx.fillStyle = "white";
        this._ctx.fillText("Перейти", button.width * 0.25, y);
        this._ctx.fillText(">", button.width * 0.9, y);
        break;

      case "merge-game":
        button.height *= 1.8;
        this._canvas.height *= 1.8;
        break;

      default:
        break;
    }

    // this._ctx.fillStyle = "rgb(200, 0, 0)";
    // this._ctx.globalAlpha = 0.5;
    // this._ctx.fillRect (0, 0, this._canvas.width, this._canvas.height);

    button.blob = this._canvas.toDataURL();

    return button;
  }

  /**
   * Создание прозрачной картинки для области клика
   * @return {string}
   * @private
   */
  _createClickSticker() {
    const zone = {};

    this._ctx.restore();

    zone.width = this._width * this._scale;
    zone.height = this._height * this._scale;

    this._canvas.width = zone.width;
    this._canvas.height = zone.height;

    zone.blob = this._canvas.toDataURL();

    return {
      sticker_type: "renderable",
      sticker: {
        content_type: "image",
        blob: zone.blob,
        transform: { gravity: "left_top" },
        can_delete: false,
        clickable_zones: [
          {
            action_type: "link",
            action: {
              link: "https://vk.com/app51442719",
            },
            clickable_area: [
              { x: 0, y: 0 },
              { x: zone.width, y: 0 },
              { x: zone.width, y: zone.height },
              { x: 0, y: zone.height },
            ],
          },
        ],
      },
    };
  }

  /**
   * Создает изображение с заданным текстом
   * @param {string} text - текст сообщения
   * @return { {width, height, blob} } - объект, сожержаий: ширину, высоту и изображение в base64
   * @private
   */
  _createPredict(text) {
    const predict = {};
    let data = {},
      offset;

    this._ctx.restore();
    this._fontSize = this._fontSize * this._scale;

    predict.width = this._width * 0.68 * this._scale;
    predict.height = this._height * 0.4 * this._scale;

    this._canvas.width = predict.width;
    this._canvas.height = predict.height;

    //this._ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    //this._ctx.fillRect(0, 0, predict.width, predict.height);

    data = this._pretend(text);

    this._fontSize = data.font;

    this._ctx.font = `bold ${Math.floor(data.font) - 2}px Gotham Pro`;
    this._ctx.textAlign = "center";
    this._ctx.fillStyle = "white";

    offset = data.strings.length * data.font - data.font * 1.5;
    offset = predict.height / 2 - offset / 2;

    data.strings.forEach((phrase, index) => {
      this._ctx.fillText(
        phrase,
        predict.width / 2,
        data.font * index + offset,
        predict.width - 10
      );
    });

    predict.blob = this._canvas.toDataURL();

    return predict;
  }

  /**
   * Создает изображение фона + предсказание
   * @param url - урл изображения фона
   * @param {{width, height, blob}=} prediction - объект получнный из this._createPredict() или ничего
   * @return {Promise<string>} - base64 строка
   * @private
   */
  async _createBgImage(url, prediction) {
    const bg = await this._loadImage(url),
      predict = await this._loadImage(prediction.blob);

    this._ctx.restore();

    this._canvas.width = this._width * this._scale;
    this._canvas.height = this._height * this._scale;

    if (bg)
      this._ctx.drawImage(bg, 0, 0, this._canvas.width, this._canvas.height);

    this._ctx.rotate(Math.PI * 180 * -10);

    if (predict)
      this._ctx.drawImage(
        predict,
        this._canvas.width * 0.165,
        this._canvas.height * 0.312
      );

    this._ctx.rotate(Math.PI * 180 * 10);

    this._backgroundBlob = this._canvas.toDataURL();

    return this._backgroundBlob;
  }

  /**
   * Создает фон для нового уровня печеньки
   * @param {number} biggest - уровень наибольшей печеньки
   * @param {[]} cookies - массив загруженных изображений 4-х фоновых печенек
   * @returns {Promise<void>}
   * @private
   */
  async _createGameBgImage(biggest, cookies = []) {
    const pi = Math.PI / 180,
      url = "https://bottle.cookieapp.ru:4444/public/stories/merge-game.jpg",
      bg = await this._loadImage(url),
      big = await this._loadImage(
        "https://bottle.cookieapp.ru:4444/public/cookies/" + biggest + ".png",
        false
      );

    this._ctx.restore();

    this._canvas.width = this._width * this._scale;
    this._canvas.height = this._height * this._scale;

    const data = [
      {
        img: cookies[0],
        s: 0.42,
        x: -0.22,
        y: -0.02,
        angle: 3,
        filter: "blur(2px)",
      },
      { img: cookies[1], s: 0.27, x: 0.62, y: 0.08, angle: -5 },
      { img: cookies[2], s: 0.3, x: -0.68, y: 0.54, angle: -25 },
      { img: cookies[3], s: 0.25, x: 0.95, y: 0.48, angle: 7 },
    ];

    let pic, i;

    // рисуем задний фон
    if (bg)
      this._ctx.drawImage(bg, 0, 0, this._canvas.width, this._canvas.height);

    // рисуем 4 фоновых печеньки (по "углам")
    for (i = 0; i < 4; i++) {
      pic = data[i];

      // если вдруг изображение нет - уходим, продолжая
      if (!pic.img) continue;

      this._ctx.save();

      if (pic.angle) this._ctx.rotate(pi * pic.angle);
      if (pic.filter) this._ctx.filter = pic.filter;

      this._ctx.translate(
        this._canvas.width * pic.x,
        this._canvas.height * pic.y
      );

      this._ctx.drawImage(
        pic.img,
        0,
        0,
        this._canvas.width * pic.s,
        this._canvas.width * pic.s
      );

      if (pic.filter) this._ctx.filter = "none";

      this._ctx.restore();
    }

    // рисуем большую печеньку
    if (big)
      this._ctx.drawImage(
        big,
        this._canvas.width * 0.5 - this._canvas.width * 0.18,
        this._canvas.height * 0.57 - this._canvas.width * 0.18,
        this._canvas.width * 0.36,
        this._canvas.width * 0.36
      );

    // сохраняем полученный фон
    this._backgroundBlob = this._canvas.toDataURL();
  }

  /**
   * Создает изображенеи и возвращает его после загрузки браузером
   * @param {string} image
   * @param {boolean=} cors
   * @return {Promise<(HTMLImageElement|null)>}
   * @private
   */
  _loadImage(image, cors = true) {
    return new Promise((resolve) => {
      if (!image) return resolve(null);

      const img = new Image();

      img.crossOrigin = cors ? "use-credentials" : "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = image;
    });
  }

  /**
   * Открывает радактор историй
   * @param {string} url - строка урл или фон в base64
   * @param { {width, height, blob} } button
   * @param { {width, height, blob}= } predict
   * @private
   */
  async _openStoryBox(url, button, predict) {
    const result = { success: false, response: null };

    const data = {
      background_type: this._backgroundType,
      locked: true,
      stickers: [
        {
          sticker_type: "renderable",
          sticker: {
            content_type: "image",
            blob: button.blob,
            transform: {
              gravity: "center_bottom",
              translation_y: this._translateButton,
            },
            can_delete: false,
            // clickable_zones: [
            //   {
            //     // action_type: "app",
            //     // action: {
            //     //   app_id: this._app_id,
            //     //   app_context: "sp=" + this._uid
            //     // },
            //     action_type: "link",
            //     action: {
            //       link: "https://vk.com/" + this._app_name + "#sp" + this._uid,
            //     },
            //     clickable_area: [
            //       { x: 0, y: 0 },
            //       { x: button.width, y: 0 },
            //       { x: button.width, y: button.height },
            //       { x: 0, y: button.height },
            //     ],
            //   },
            // ],
          },
        },
      ],
    };

    if (this._backgroundType === "video ") {
      data.url = url;
      data.stickers.push({
        sticker_type: "renderable",
        sticker: {
          content_type: "image",
          blob: predict.blob,
          transform: {
            rotation: 1,
            gravity: "center",
            translation_y: -0.118,
            translation_x: 0.1,
          },
          can_delete: false,
        },
      });
    } else {
      data.blob = url;
    }

    data.stickers.push(this._createClickSticker());

    try {
      result.response = await this._bridge.send("VKWebAppShowStoryBox", data);
      result.success = true;

      return result;
    } catch (e) {
      result.response = e;
      return result;
    }
  }

  /**
   * Подбирает необходимый размер шрифта и кол-во строк для предсказания.
   * @param {string} message - строка текста
   * @param {=string} scale - начальный масштаб
   * @return {{strings: array, scale: string, font: number}}
   * @private
   */
  _pretend(message, scale) {
    let length, strings, font;

    if (!scale) {
      length = message.length;

      // if (length < 32) {
      //   scale = "giant";
      // } else if (length < 52) {
      //   scale = "bigger";
      // } else if (length < 76) {
      //   scale = "big";
      // } else if (length < 110) {
      //   scale = "large";
      // } else {
      scale = "normal";
      //}
    }

    if (scale === "giant") {
      font = this._fontSize * 2.4;
      strings = split(message, 14);

      if (strings.length > 2) {
        return this._pretend(message, "bigger");
      }
    }

    if (scale === "bigger") {
      font = this._fontSize * 2.1;
      strings = split(message, 16);

      if (strings.length > 3) {
        return this._pretend(message, "big");
      }
    }

    if (scale === "big") {
      font = this._fontSize * 1.65;
      strings = split(message, 18);

      if (strings.length > 4) {
        return this._pretend(message, "large");
      }
    }

    if (scale === "large") {
      font = this._fontSize * 1.3;
      strings = split(message, 21);

      if (strings.length > 5) {
        return this._pretend(message, "normal");
      }
    }

    if (scale === "normal") {
      font = this._fontSize;
      strings = split(message, 30);
    }

    return { font, strings, scale };

    function split(text, limit) {
      let i, length;
      let line, counter, word;
      let result = [""];

      text = text.split(" ");
      line = 0;
      counter = 0;

      for (i = 0, length = text.length; i < length; i++) {
        word = text[i];

        counter += word.length;

        if (counter > limit) {
          line++;
          counter = 0;
          result[line] = "";
        }

        result[line] += word + " ";
        counter++;
      }

      return result;
    }
  }
}

/**
 * Готовый объект для постинга предсказний а сторис
 * init( app_id, bridge, uid, os ) - инициализация
 * openPredictStoryBox( predict, type ) - постинг
 */
export default new VideoStories();
