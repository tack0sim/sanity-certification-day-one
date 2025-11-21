export type SiteName = 'site-1' | 'site-2';
export type SiteTitle = 'Site 1' | 'Site 2';

export type Site = {
  name: SiteName;
  title: string;
  url: string;
};

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
];

export const getSite = (siteName: SiteName) => {
  const site = SITES.find((s) => s.name === siteName);
  return site?.name ?? String(siteName);
};

export const getSiteTitle = (site: SiteTitle) => {
  const siteFound = SITES.find((s) => s.title === site);
  return siteFound ? siteFound.title : String(site);
};
