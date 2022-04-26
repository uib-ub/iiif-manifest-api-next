export const getQuery = (id, manifestBase,) => {
  const query = `
        PREFIX  sc:   <http://iiif.io/api/presentation/3#>
        PREFIX  oa:   <http://www.w3.org/ns/oa#>
        PREFIX  dct:  <http://purl.org/dc/terms/>
        PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX  ubbont: <http://data.ub.uib.no/ontology/>
        PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX  dc:   <http://purl.org/dc/elements/1.1/>
      
        CONSTRUCT 
          { 
            ?manifestURL rdf:type sc:Manifest .
            ?manifestURL dct:identifier ?id .
            ?manifestURL rdfs:label ?title .
            ?manifestURL rdfs:seeAlso ?s .
            ?manifestURL sc:homepage ?homepage .
            ?manifestURL dc:description ?desc .
            ?manifestURL sc:thumbnail ?thumb .
            ?manifestURL sc:items ?part .
            ?manifestURL sc:items ?singleCanvas .
            ?manifestURL sc:structures ?rangeURL .
            ?rangeURL rdf:type sc:Range .
            ?rangeURL sc:items ?part .
            ?rangeURL sc:items ?singleCanvas .
            ?part rdf:type sc:Canvas .
            ?part rdfs:label ?seq .
            ?part sc:thumbnail ?canvasThumb .
            ?part sc:items ?resource .
            ?resource rdf:type oa:Annotation .
            ?resource oa:body ?imgUrl .
            ?singleCanvas rdf:type sc:Canvas .
            ?singleCanvas rdfs:label 1 .
            ?singleCanvas sc:thumbnail ?singleCanvasThumb .
            ?singleCanvas sc:items ?singlePart .
            ?singlePart rdf:type oa:Annotation .
            ?singlePart oa:body ?singleImageUrl .
          }
        WHERE
          { GRAPH ?g
              { VALUES ?id { "${id}" }
                ?s  dct:identifier        ?id ;
                    ubbont:hasRepresentation  ?repr ;
                    dct:title             ?title ;
                    ubbont:hasThumbnail   ?thumb
                OPTIONAL
                  { ?s  dct:description  ?desc }
                OPTIONAL
                  { ?repr     dct:hasPart       ?singlePart ;
                              rdfs:label        ?partLabel .
                    ?singlePart  ubbont:hasXSView  ?singleCanvasThumb
                    OPTIONAL
                      { ?singlePart  ubbont:hasMDView  ?singleMD }
                    OPTIONAL
                      { ?singlePart  ubbont:hasSMView  ?singleSM }
                  }
                BIND(coalesce(?singleMD, ?singleSM) AS ?singleImage)
                OPTIONAL
                  { ?repr     dct:hasPart         ?part ;
                              rdfs:label          ?partLabel .
                    ?part     ubbont:hasResource  ?resource ;
                              ubbont:sequenceNr   ?seq .
                    ?resource  ubbont:hasMDView   ?image ;
                              ubbont:hasXSView    ?canvasThumb
                  }
                BIND(iri(?image) AS ?imgUrl)
                BIND(iri(?singleImage) AS ?singleImageUrl)
                BIND(iri(concat("${manifestBase}", ?partLabel)) AS ?manifestURL)
                BIND(iri(concat("http://data.ub.uib.no/instance/manuscript/", ?id, "/manifest/range/1")) AS ?rangeURL)
                BIND(iri(concat("http://data.ub.uib.no/instance/page/", ?id, "_p1")) AS ?singleCanvas)
                BIND(iri(replace(str(?s), "data.ub.uib.no", "marcus.uib.no", "i")) AS ?homepage)
              }
          }
        ORDER BY ?s ?repr ?part ?resource ?image
      `

  return query
} 