import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>UBB IIIF Manifest API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          UBB IIIF Manifest API
        </h1>
        <h2>
          University of Bergen Library IIIF manifest for objects in the Special collection.
        </h2>
        <p className={styles.description}>
          IIIF Presentation API v3 compliant. The API serves objects from <a href="https://marcus.uib.no">Marcus</a> and <a href="https://skeivtarkiv.no">The Norwegian archive for queer history</a>.
          The API is a simple wrapper over a SPARQL endpoint that maps the result to a simple IIIF manifest.
          <br />
          Any valid id or <i>signature</i> from these datasets will be resolved. Test some example manifests!
        </p>

        <p className={styles.description}>
          <strong>Marcus:</strong>
          <br />
          <Link href="/api/manifest/marcus/ubb-ms-0003"><a>api/manifest/marcus/ubb-ms-0003</a></Link>
          <br />
          <Link href="/api/manifest/marcus/ubb-ms-0185-j-a-007"><a>api/manifest/marcus/ubb-ms-0185-j-a-007</a></Link>
          <br />
          <Link href="/api/manifest/marcus/ubb-wil-f-208"><a>api/manifest/marcus/ubb-wil-f-208</a></Link>
        </p>

        <p className={styles.description}>
          <strong>Skeivt arkiv:</strong>
          <br />
          <Link href="/api/manifest/skeivtarkiv/ubb-ska-0001-f-01-01-02"><a>api/manifest/skeivtarkiv/ubb-ska-0001-f-01-01-02</a></Link>
          <br />
          <Link href="/api/manifest/skeivtarkiv/ubb-ska-a0009-u-457"><a>api/manifest/skeivtarkiv/ubb-ska-a0009-u-457</a></Link>
          <br />
          <Link href="/api/manifest/skeivtarkiv/ubb-ska-a0033-u-0002"><a>api/manifest/skeivtarkiv/ubb-ska-a0033-u-0002</a></Link>
        </p>

        <p className={styles.description}>
          Add a manifest to <Link href="https://mirador-dev.netlify.app/">Mirador 3</Link>
        </p>

        <p className={styles.description}>
          <Link href="https://github.com/uib-ub/iiif-manifest-api-next">Github</Link>
        </p>
      </main>
    </div>
  )
}