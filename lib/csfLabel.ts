import BufferConverter from "./buffer"

const LABEL_IDENTIFIER = " LBL";
const LABEL_UNKNOWN = 1;

export function csfLabelToBuffer(label: string) {
  const labelIdentifierBuffer = BufferConverter.stringToBufferInt8(LABEL_IDENTIFIER);
  const labelUnknownBuffer = BufferConverter.toBufferInt32(LABEL_UNKNOWN);
  const labelLengthBuffer = BufferConverter.toBufferInt32(label.length);
  const labelNameBuffer = BufferConverter.stringToBufferInt8(label);

  return Buffer.concat([
    labelIdentifierBuffer,
    labelUnknownBuffer,
    labelLengthBuffer,
    labelNameBuffer
  ])
}