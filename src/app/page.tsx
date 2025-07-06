import {redirect} from 'next/navigation';

// This is the root page of the application.
// This page only renders when the app is built statically (output: 'export')
// It redirects to the default locale page, which is '/en' in this case.
export default function RootPage() {
  redirect('/en');
}
