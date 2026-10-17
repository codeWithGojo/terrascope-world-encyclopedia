import {SiteHeader} from '../components/SiteHeader';
import {SiteFooter} from '../components/SiteFooter';
import {getViewer} from '../auth/viewer';
import {authConfigured} from '../auth/config';
import {AccountPanel} from './AccountPanel';
export const dynamic='force-dynamic';
export default async function AccountPage() {
  const {user,features}=await getViewer();
  return <main><SiteHeader/><section className="index-hero"><p className="eyebrow"><span/>Your corner of the world</p><h1>Pick up<br/>where you left off.</h1><p>Save your daily discoveries across devices when accounts are available.</p></section><section className="account-section"><AccountPanel configured={authConfigured()} email={user?.email??null} pro={features.pro}/></section><SiteFooter/></main>;
}
