import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Root layout. `<html>` and `<body>` are rendered by `app/[locale]/layout.tsx`
// (with the correct `lang`) and by `app/not-found.tsx`, so this layout only
// passes children through. Rendering `<html>` here as well produced nested
// documents and a hydration mismatch.
export default function RootLayout({ children }: Props) {
  return children;
}
