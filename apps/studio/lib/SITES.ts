export type siteName = 'site-1' | 'site-2'

export type Site = {
  name: siteName
  title: string
  url: string
}

export const SITES: Site[] = [
  {
    name: 'site-1',
    title: 'Site 1',
    url: 'http://localhost:3334',
  },
  {
    name: 'site-2',
    title: 'Site 2',
    url: 'http://localhost:3335',
  },
]

export const getSite = (siteName: siteName) => {
  SITES.find((site) => site.name === siteName)
}
