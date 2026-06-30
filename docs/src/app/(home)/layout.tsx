import { getGitHubStars } from '@inkeep/open-knowledge-core';
import { SiteNav } from './site-nav';

export default async function Layout({ children }: LayoutProps<'/'>) {
  const stars = await getGitHubStars({ next: { revalidate: 3600 } });
  return (
    <>
      <SiteNav stars={stars} />
      <main>{children}</main>
    </>
  );
}
