import { AdvanceRowGen } from "./AdvancedRowGen"

describe('AdvancedRowGen', () => {
  it('should not contain 0', () => {
    const rowGen = new AdvanceRowGen(['0'])
    for(const features of rowGen.features) {
      const row = rowGen.renderRow(features)
      expect(row.some((it) => it === 0)).toBeFalsy()
    }
  })
})
