import BufferConverter from "./buffer";

const STRING_IDENTIFIER = " RTS";

export function csfStringToBuffer(string: string) {
  const stringIdentifierBuffer = BufferConverter.stringToBufferInt8(STRING_IDENTIFIER);
  const stringLengthBuffer = BufferConverter.toBufferInt32(string.length);
  const stringBuffer = BufferConverter.stringToBufferInt16(string);

  return Buffer.concat([
    stringIdentifierBuffer,
    stringLengthBuffer,
    stringBuffer
  ])
}