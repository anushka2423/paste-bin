import { ConfigProvider } from 'antd';
import '../styles/globals.css'

export const metadata = {
  title: 'Pastebin-Lite',
  description: 'Share text snippets easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#667eea',
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
