/* eslint-env jest */
import Curve from '../Curve'

describe('utils', () => {
  it('should convert to array', () => {
    expect(Curve.toArray('1234', 'hex')).toEqual([0x12, 0x34])
    expect(Curve.toArray('1234')).toEqual([49, 50, 51, 52])
    expect(Curve.toArray('1234', 'utf8')).toEqual([49, 50, 51, 52])
    expect(Curve.toArray('\u1234234')).toEqual([18, 52, 50, 51, 52])
    expect(Curve.toArray([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
  })

  it('should zero pad byte to hex', () => {
    expect(Curve.zero2('0')).toBe('00')
    expect(Curve.zero2('01')).toBe('01')
  })

  it('should convert to hex', () => {
    expect(Curve.toHex([0, 1, 2, 3])).toBe('00010203')
  })

  it('should encode', () => {
    expect(Curve.encode([0, 1, 2, 3])).toEqual([0, 1, 2, 3])
    expect(Curve.encode([0, 1, 2, 3], 'hex')).toBe('00010203')
  })
})
