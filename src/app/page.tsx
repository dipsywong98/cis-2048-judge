import { serialize } from 'next-mdx-remote/serialize'
import { MDXWrapper } from './mdxWrapper'

export default async function RemoteMdxPage({searchParams}: {searchParams: {showAdvance: string}}) {
  const res = await fetch('https://hackmd.io/YkCy78oCTLil9oKIdlef-Q/download', { cache: "no-cache" })
  const mdxText = await res.text()
  const mdxSource = await serialize(mdxText)
  const content = [<MDXWrapper key="basic" {...mdxSource} />]
  if (searchParams.showAdvance === 'please') {
    const res2 = await fetch('https://hackmd.io/c6HxWyBKSHyI6xXOblUBZg/download', { cache: "no-cache" })
    const mdxText2 = await res2.text()
    const mdxSource2 = await serialize(mdxText2)
    content.push(<MDXWrapper key="advance" {...mdxSource2} />)
  }
  return content
}
