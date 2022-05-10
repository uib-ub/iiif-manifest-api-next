export async function constructManifest(data, API) {
  let manifest = {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: data.id,
    type: data.type,
    label: { no: [data.label] },
    ...(data.description && {
      summary: {
        none: [data.description]
      }
    }),
    thumbnail: [
      {
        id: data.thumbnail.value,
        type: "Image",
        format: "image/jpeg"
      }
    ],
    viewingDirection: "left-to-right",
    behavior: ["paged"],
    homepage: [
      {
        id: data.homepage,
        type: "Text",
        label: {
          en: [`Home page for ${data.label}`],
          no: [`Nettside for ${data.label}`]
        },
        format: "text/html"
      }
    ],
    seeAlso: [
      {
        id: `${API}describe<${data.seeAlso}>`,
        type: "Dataset",
        label: {
          en: ["Object Description in RDF"],
          en: ["Objekt beskrivelse i RDF"]
        },
        format: "application/rdf+xml"
      }
    ],
    provider: [
      {
        id: "https://www.uib.no/ub",
        type: "Agent",
        label: {
          no: ["Universitetsbiblioteket i Bergen"],
          en: ["University of Bergen Library"]
        },
        homepage: [
          {
            id: "https://www.uib.no/ub",
            type: "Text",
            label: {
              no: ["Universitetsbiblioteket i Bergen hjemmeside"],
              en: ["University of Bergen Library Homepage"]
            },
            format: "text/html"
          }
        ],
        logo: [
          {
            id: "https://marcus-manifest-api.vercel.app/uib-logo.png",
            type: "Image",
            format: "image/png",
            width: 200,
            height: 200,
          }
        ]
      }
    ],
    rights: "http://creativecommons.org/licenses/by/4.0/",
    requiredStatement: {
      label: {
        no: ["Kreditering"],
        en: ["Attribution"]
      },
      value: {
        no: ["Tilgjengeliggjort av Universitetsbiblioteket i Bergen"],
        en: ["Provided by University of Bergen Library"]
      }
    },
    items: [
      ...data.items.map(canvas => {
        return {
          id: canvas.id,
          type: canvas.type,
          label: { none: [`${canvas.label}`] },
          width: 1024,
          height: 1024,
          thumbnail: [
            {
              id: canvas.thumbnail,
              type: "Image",
              width: 200,
              height: 200,
            }
          ],
          items: [
            {
              id: canvas.items.id,
              type: "AnnotationPage",
              items: [
                {
                  id: `${canvas.id}/annotation/1`,
                  type: "Annotation",
                  motivation: "painting",
                  target: canvas.id,
                  body: {
                    id: canvas.items.body.id,
                    type: "Image",
                    format: "image/jpeg",
                    width: 1024,
                    height: 1024,
                  },
                }
              ]
            }
          ]
        }
      })
    ],
    structures: [
      {
        id: data.structures.id,
        type: data.structures.type,
        label: {
          no: ["Standard innholdsfortegnelse"],
          en: ["Default"]
        },
        items: [
          ...data.structures.items.map(item => {
            return {
              id: item,
              type: "Canvas",
            }
          })
        ]
      }
    ]
  }

  return manifest
}
