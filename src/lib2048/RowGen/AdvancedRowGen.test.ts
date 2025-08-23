import { AdvanceRowGen } from "./AdvancedRowGen"

describe('AdvancedRowGen', () => {
  it('should contain only valid characters', () => {
    for (let i = 0; i < 1000; i++) {
      const rowGen = new AdvanceRowGen(['0', '1', '*2'])
      for (const feature of rowGen.features) {
        const row = rowGen.renderRow(feature)
        const match = row.map((it) => [null, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, '0', '1', '*2'].includes(it))
        if (match.some(it => !it)) {
          console.log(feature, row, match)
          expect(match).toEqual(row.map(() => true))
        }
      }
    }
  })
})
