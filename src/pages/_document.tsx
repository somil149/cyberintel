import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="CyberIntel — 20 years of cybersecurity attack intelligence (2005–2026)" />
        <meta name="theme-color" content="#0a0e1a" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="CyberIntel — 21 Years of Cybersecurity Intelligence" />
        <meta property="og:description" content="Free threat intelligence platform covering 46 real incidents, MITRE ATT&CK heatmap, threat actor profiles, and CVE analysis from 2005–2026." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://somil149.github.io/cyberintel/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CyberIntel — 21 Years of Cybersecurity Intelligence" />
        <meta name="twitter:description" content="Free threat intelligence platform: 46 incidents, MITRE ATT&CK, threat actors, CVE intel. Built by Somil Goyal." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
