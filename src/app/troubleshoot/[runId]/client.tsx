'use client'
import { EvaluationResult, getEvaluationResult } from '../../../lib2048/log'
import { detectEndgame, generateNewTile, mergeWithDirection } from "@/lib2048/game";
import { TestCaseResult } from "@/lib2048/evaluate";
import { ReactNode, useState } from "react";

interface Props {
  evaluationResult: EvaluationResult
}

type Grid = Array<Array<string | number | null | ReactNode>>

const wrap = (v: string | number | null | ReactNode) => {
  if (typeof v === 'string') {
    return `'${v}'`
  }
  return v ?? ' '
}

const GridDisplay = ({ grid }: { grid: Grid }) => {
  return (
    <table>
      {grid.map((row, rowId) => (
        <tr key={rowId}>
          {row.map((cell, colId) => <td key={colId}>{wrap(cell)}</td>)}
        </tr>
      ))}
    </table>
  )
}

const DiffValueDisplay = ({ a, b }: { a: string | number | null | ReactNode, b : string | number | null | ReactNode}) => {
  if (a === b) {
    return <span>{wrap(a)}</span>
  }
  return (
    <span >
      <span style={{ color: 'red' }}>{wrap(a)}</span>
      <span style={{ color: 'green' }}>{wrap(b)}</span>
    </span>
  )
}

const DiffGridDisplay = ({a, b}: {a: Grid, b: Grid}) => {
  const grid = Array(Math.max(a.length, b.length)).fill('').map((_, rowId) => {
    const rowA = a[rowId] || undefined
    const rowB = b[rowId] || undefined
    return Array(Math.max(rowA?.length ?? 0, rowB?.length ?? 0)).fill('').map((_, colId) => {
      const cellA = a[rowId]?.[colId]
      const cellB = b[rowId]?.[colId]
      return <DiffValueDisplay key={`${rowId}-${colId}`} a={cellA} b={cellB} />
    })
  })
  return <GridDisplay grid={grid}/>
}

const TestCaseResultDisplay = ({testCaseResult}: {testCaseResult: TestCaseResult}) => {
  const expectedMerged = mergeWithDirection(testCaseResult.testCase.requestPayload.grid, testCaseResult.testCase.requestPayload.mergeDirection)
  const expectedEndgame = detectEndgame(generateNewTile(expectedMerged))
  return (
    <div>
      {JSON.stringify(testCaseResult.correct)}
      <table>
        <thead>
          <th>Input</th>
          <th>Output</th>
          {/* <th>Expect Output</th>
          <th>Actual Output</th> */}
        </thead>
        <tbody>
          <tr>
            <td>
              Direction={testCaseResult.testCase.requestPayload.mergeDirection}
              <GridDisplay grid={testCaseResult.testCase.requestPayload.grid} />
            </td>
            <td>
              EndGame=<DiffValueDisplay a={expectedEndgame} b={testCaseResult.response?.endGame} />
              <DiffGridDisplay a={expectedMerged} b={testCaseResult.response?.nextGrid ?? []} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Client = ({ evaluationResult }: Props) => {
  const requirements = Object.keys(evaluationResult.evaluationResult.allTestResults)
  const [requirementName, setRequirementName] = useState(requirements[0])
  const [testCaseId, setTestCaseId] = useState(0)
  const selectedTestCase = evaluationResult.evaluationResult.allTestResults[requirementName]?.[testCaseId]
  return (
    <main>
      score={(evaluationResult.callbackPayload.score * 5).toFixed(0)} teamUrl={evaluationResult.teamUrl}
      <pre>

      {evaluationResult.callbackPayload.message}
      </pre>
      <select onChange={({target}) => setRequirementName(target.value)}>
        {requirements.map((r => <option key={r} value={r}>{r}</option>))}
      </select>
      test case id: <input type="number" value={testCaseId} onChange={({target}) => setTestCaseId(Number(target.value))}/>
      {selectedTestCase ? <TestCaseResultDisplay testCaseResult={selectedTestCase} /> : 'selected test case not found'}
    </main>
  );
};

export default Client;