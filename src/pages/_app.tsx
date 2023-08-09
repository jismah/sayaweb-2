import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layouts/LayoutPrincipal'

export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const router = useRouter()

  if (router.pathname.startsWith('/App')) {
    return (
      <ChakraProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Head>
            <title>Saya Web</title>
            <link rel="icon" href="/favicon-saya.png" />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionContextProvider>
      </ChakraProvider>
    )
  } else {
    return (
      <ChakraProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Head>
            <title>Saya Web</title>
            <link rel="icon" href="/favicon-saya.png" />
          </Head>
          <Component {...pageProps} />
        </SessionContextProvider>
      </ChakraProvider>
    )
  }
}
