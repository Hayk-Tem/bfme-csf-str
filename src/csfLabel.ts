import BufC from "./utils/buffer"

export class CsfLabel {
  #identifier = " LBL";
  #unknown = 1;
  #buffer;
  label;
  length;
  constructor(label: string) {
    this.label = label;
    this.length = label.length;
    this.#buffer = this.#toBuffer();
  }

  get buffer() {
    return this.#buffer
  }

  #toBuffer() {
    const identifier = BufC.stringToBufferInt8(this.#identifier);
    const unknown = BufC.toBufferInt32(this.#unknown);
    const labelLen = BufC.toBufferInt32(this.length);
    const label = BufC.stringToBufferInt8(this.label);

    return Buffer.concat([
      identifier,
      unknown,
      labelLen,
      label
    ])
  }
}