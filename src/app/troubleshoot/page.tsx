import { getEvaluationResults } from "@/lib2048/log";

export default async function Page() {
  const evaluationResults = await getEvaluationResults()
  return (
    <main>
      <h1>Evaluation Results</h1>
      <table>
        <thead>
          <th>
            EvaluatedAt
          </th>
          <th>
            RunId
          </th>
          <th>
            Score
          </th>
          <th>
            TeamUrl
          </th>
        </thead>
        <tbody>
          {evaluationResults.map((row) => (
            <tr key={row._id}>
              <td>
                {row.evaluatedAt?.toLocaleString()}
              </td>
              <td>
                <a href={`/troubleshoot/${row.runId}`}>
                  {row.runId}
                </a>
              </td>
              <td>
                {row.score.toFixed(0)}
              </td>
              <td>
                {row.teamUrl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}