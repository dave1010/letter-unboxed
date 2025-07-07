export const metadata = {
  title: 'Letter Unboxed',
  description: 'Tools for exploring solutions to the NYT Letter Boxed game',
}

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white bg-[length:200%_200%] animate-gradient">{children}</body>
    </html>
  )
}

