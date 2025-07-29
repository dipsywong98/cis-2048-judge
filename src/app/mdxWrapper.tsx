'use client'

import { MDXRemote } from "next-mdx-remote"

export const MDXWrapper: typeof MDXRemote = (props) => <MDXRemote {...props} />