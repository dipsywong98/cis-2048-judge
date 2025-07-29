import { serialize } from 'next-mdx-remote/serialize'
import { MDXWrapper } from './mdxWrapper'

export default async function RemoteMdxPage() {
  const res = await fetch('https://hackmd.io/A3vlcU7nTOakwCgwIQcubA/download', { cache: "no-cache" })
  const mdxText = await res.text()
  const mdxSource = await serialize(mdxText)
  return <MDXWrapper {...mdxSource} />
}
