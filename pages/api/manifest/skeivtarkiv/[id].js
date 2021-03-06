import * as jsonld from 'jsonld'
import { omit, sortBy } from 'lodash'
import { constructManifest } from '../../../../lib/constructManifest'
import { defaultFrame } from '../../../../lib/defaultFrame'
import { getQuery } from '../../../../lib/getQuery'

const MANIFEST_BASE = "https://ub-iiif.vercel.app/api/manifest/skeivtarkiv/"
const API = "http://sparql.ub.uib.no/skeivtarkiv/query?query="
const FRAME = defaultFrame
const PROVIDER = [
  {
    id: "https://skeivtarkiv.no",
    type: "Agent",
    label: {
      no: ["Skeivtarkiv"],
      en: ["The Norwegian archive for queer history"]
    },
    homepage: [
      {
        id: "https://skeivtarkiv.no",
        type: "Text",
        label: {
          no: ["Skeivtarkiv hjemmeside"],
          en: ["The Norwegian archive for queer history Homepage"]
        },
        format: "text/html"
      }
    ],
    logo: [
      {
        id: "https://marcus-manifest-api.vercel.app/skeivtarkiv-logo.svg",
        type: "Image",
        format: "image/png",
        width: 200,
        height: 200,
      }
    ]
  }
]

async function getObject(id) {
  if (!id) return error

  const query = getQuery(id, MANIFEST_BASE)
  const results = await fetch(`${API}${encodeURIComponent(query)}&output=json`)

  return results
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req


  switch (method) {
    case 'GET':
      const response = await getObject(id)

      if (response.status >= 200 && response.status <= 299) {
        const results = await response.json();
        // Frame the result for nested json
        const awaitFramed = jsonld.frame(results, FRAME);
        let framed = await awaitFramed

        // Remove json-ld context 
        framed = omit(framed, ["@context"])

        // When HumanMadeObject is a single page we convert to an array of one
        if (Array.isArray(framed.items) == false) {
          framed.items = [framed.items]
        }
        if (Array.isArray(framed.structures.items) == false) {
          framed.structures.items = [framed.structures.items]
        }

        // Sort nested arrays
        framed.items = sortBy(framed.items, o => o.label)
        framed.structures.items = sortBy(framed.structures.items, i => parseInt(i.split("_p")[1]))

        // Create the manifest
        const constructedManifest = await constructManifest(framed, API)
        let manifest = await constructedManifest
        manifest.provider = PROVIDER

        res.status(200).json(manifest)
      } else {
        // Handle errors
        console.log(response.status, response.statusText);
      }

      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
