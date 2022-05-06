import type { MetaFunction, LoaderFunction } from 'remix';
import { redirect } from 'remix';
import { useLoaderData } from 'remix';

import SiteLayout from '../components/SiteLayout';

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  topPages: Array<{ name: string; to: string; isPrimary?: boolean }>;
};

export let loader: LoaderFunction = () => {
  return redirect('/auth');
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit',
    description: 'Welcome to Remix Starter Kit',
  };
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <SiteLayout></SiteLayout>;
}
