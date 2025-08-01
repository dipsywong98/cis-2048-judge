import { serialize } from 'next-mdx-remote/serialize'
import { MDXWrapper } from './mdxWrapper'

export default async function RemoteMdxPage() {
  const res = await fetch('https://hackmd.io/YkCy78oCTLil9oKIdlef-Q/download', { cache: "no-cache" })
  const mdxText = await res.text()
  const mdxSource = await serialize(mdxText)
  return <MDXWrapper {...mdxSource} />
}
