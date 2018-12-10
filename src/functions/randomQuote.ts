const para: any = require("../../paragraphs/para");

/**
 * @function randomNumQuote
 */
export function randomNumQuote() {
  const randomNumber: number = Math.floor((Math.random() * para.length));
  let quote: string = para[randomNumber].para;
  if (quote.length < 100) {
    quote = para[randomNumber].para + " " + para[randomNumber - 1].para;
  }
  return quote;
}
