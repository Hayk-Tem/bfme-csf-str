class BufferConverter {
  constructor() { };

  static stringToBufferInt8 = function (string: string) {
    return Buffer.alloc(string.length, string) //Buffer.from(new Int8Array([...string].map(str => str.codePointAt(0)!)).buffer)
  }

  static stringToBufferInt16(string: string) {
    return Buffer.from(new Int16Array([...string].map(str => (str.codePointAt(0)! + 1) * -1)).buffer)
    // return Buffer.from(new Int16Array([...string].map(str => ~str.codePointAt(0)!)).buffer)
  }

  static toBufferInt32(number: number) {
    return Buffer.from(new Int32Array([number]).buffer)
  }
}

export default BufferConverter