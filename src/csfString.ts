import BufC from "./utils/buffer";

export class CsfString {
  #identifier = " RTS"
  string;
  length;
  #buffer;
  constructor(string: string) {
    this.string = string;
    this.length = string.length;
    this.#buffer = this.#toBuffer();
  }

  get buffer() {
    return this.#buffer
  }

  #toBuffer() {
    const identifier = BufC.stringToBufferInt8(this.#identifier);
    const strLen = BufC.toBufferInt32(this.length);
    const str = BufC.stringToBufferInt16(this.string);

    return Buffer.concat([identifier, strLen, str]);
  }
}