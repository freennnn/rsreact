import { Metadata } from 'next'

import './global.css'

export const metadata: Metadata = {
  title: 'Github repositories',
  description: 'Github repositories search and explore client',
}
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <div id='root'>{children}</div>
      </body>
    </html>
  )
}
