import { getPreviewPostBySlug } from '@/root/lib/api'

export default async function preview(req, res) {
  // check the secret and next parameters
  // this secret should only be known to this API route and the CMS
  if (
    req.query.secret !== process.env.SANITY_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // fetch the headless CMS to check if the provided `slug` exists
  const post = await getPreviewPostBySlug(req.query.slug)

  // if the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // redirect to the path from the fetched post
  // we don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/post/${post.slug}` })
  res.end()
}
