import BufferConverter from "./buffer";

const HEADER_IDENTIFIER = " FSC";
const CSF_VERSION = 3;
const HEADER_UNKNOWN = 0;

export const CSF_LANGUAGE = Object.freeze({
  English_US: 0,
  English_UK: 1,
  German: 2,
  Frenc: 3,
  Spanish: 4,
  Italian: 5,
  Japanese: 6,
  Jabberwockie: 7,
  Korean: 8,
  Chinese: 9
})

export function csfHeaderToBuffer(labelsCount: number, language?: number) {
  const headerIdentifierBuffer = BufferConverter.stringToBufferInt8(HEADER_IDENTIFIER);
  const csfVersionBuffer = BufferConverter.toBufferInt32(CSF_VERSION);
  const labelsCountBuffer = BufferConverter.toBufferInt32(labelsCount);
  const headerUnknownBuffer = BufferConverter.toBufferInt32(HEADER_UNKNOWN);
  const csfLanguageBuffer = BufferConverter.toBufferInt32(language ?? 0);

  return Buffer.concat([
    headerIdentifierBuffer,
    csfVersionBuffer,
    labelsCountBuffer,
    labelsCountBuffer,
    headerUnknownBuffer,
    csfLanguageBuffer
  ])
}