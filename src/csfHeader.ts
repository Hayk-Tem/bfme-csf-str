import BufC from "./utils/buffer";

type CsfHeaderType = {
  labelsCount: number,
  language?: number,
  version?: number
}

export class CsfHeader {
  #identifier = " FSC";
  #unknown = 1;
  #buffer: Buffer;
  labelsCount: number;
  language: number;
  version: number;
  constructor(props: CsfHeaderType) {
    this.labelsCount = props.labelsCount;
    this.language = props.language ?? 0;
    this.version = props.version ?? 3;
    this.#buffer = this.#toBuffer();
  }

  get buffer() {
    return this.#buffer
  }

  #toBuffer() {
    const identifier = BufC.stringToBufferInt8(this.#identifier);
    const version = BufC.toBufferInt32(this.version);
    const labels = BufC.toBufferInt32(this.labelsCount);
    const unknown = BufC.toBufferInt32(this.#unknown);
    const language = BufC.toBufferInt32(this.language);

    return Buffer.concat([
      identifier,
      version,
      labels,
      labels,
      unknown,
      language
    ])
  }
}