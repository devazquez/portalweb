// Datos de ejemplo para Omeka-S
// POST /api/items

[
  {
    "title": "Investigación sobre Desigualdad Social en México",
    "description": "Estudio comprensivo sobre los patrones de desigualdad económica y social en México durante las últimas dos décadas.",
    "resource_class": "dctype:Text",
    "resource_template": "Default",
    "@context": "http://www.w3.org/ns/activitystreams",
    "dcterms:creator": [
      {
        "type": "literal",
        "property_label": "Creator",
        "@value": "Dr. Ramón García López"
      }
    ],
    "dcterms:issued": [
      {
        "type": "literal",
        "property_label": "Issued Date",
        "@value": "2023-06-15"
      }
    ],
    "dcterms:language": [
      {
        "type": "literal",
        "property_label": "Language",
        "@value": "es"
      }
    ],
    "dcterms:subject": [
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Desigualdad social"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Política económica"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Pobreza"
      }
    ],
    "dcterms:type": [
      {
        "type": "literal",
        "property_label": "Type",
        "@value": "Artículo de investigación"
      }
    ]
  },
  {
    "title": "Educación Superior en Transformación Digital",
    "description": "Análisis de los cambios en la educación universitaria frente a la transformación digital y la pandemia de COVID-19.",
    "resource_class": "dctype:Text",
    "resource_template": "Default",
    "dcterms:creator": [
      {
        "type": "literal",
        "property_label": "Creator",
        "@value": "Dra. María Rodríguez Sánchez"
      }
    ],
    "dcterms:issued": [
      {
        "type": "literal",
        "property_label": "Issued Date",
        "@value": "2023-09-20"
      }
    ],
    "dcterms:language": [
      {
        "type": "literal",
        "property_label": "Language",
        "@value": "es"
      }
    ],
    "dcterms:subject": [
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Educación superior"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Transformación digital"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Educación en línea"
      }
    ],
    "dcterms:type": [
      {
        "type": "literal",
        "property_label": "Type",
        "@value": "Monografía"
      }
    ]
  },
  {
    "title": "Movimientos Sociales Contemporáneos en América Latina",
    "description": "Estudio comparativo de movimientos sociales en países latinoamericanos en el siglo XXI.",
    "resource_class": "dctype:Text",
    "resource_template": "Default",
    "dcterms:creator": [
      {
        "type": "literal",
        "property_label": "Creator",
        "@value": "Dr. Carlos González Martínez"
      }
    ],
    "dcterms:issued": [
      {
        "type": "literal",
        "property_label": "Issued Date",
        "@value": "2023-04-10"
      }
    ],
    "dcterms:language": [
      {
        "type": "literal",
        "property_label": "Language",
        "@value": "es"
      }
    ],
    "dcterms:subject": [
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Movimientos sociales"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Política"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "América Latina"
      }
    ],
    "dcterms:type": [
      {
        "type": "literal",
        "property_label": "Type",
        "@value": "Artículo de investigación"
      }
    ]
  },
  {
    "title": "Sostenibilidad Ambiental y Desarrollo Económico",
    "description": "Investigación sobre la intersección entre sostenibilidad ambiental y crecimiento económico sostenible.",
    "resource_class": "dctype:Text",
    "resource_template": "Default",
    "dcterms:creator": [
      {
        "type": "literal",
        "property_label": "Creator",
        "@value": "Dra. Patricia Flores Rivera"
      }
    ],
    "dcterms:issued": [
      {
        "type": "literal",
        "property_label": "Issued Date",
        "@value": "2023-08-05"
      }
    ],
    "dcterms:language": [
      {
        "type": "literal",
        "property_label": "Language",
        "@value": "es"
      }
    ],
    "dcterms:subject": [
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Sostenibilidad ambiental"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Desarrollo económico"
      },
      {
        "type": "literal",
        "property_label": "Subject",
        "@value": "Cambio climático"
      }
    ],
    "dcterms:type": [
      {
        "type": "literal",
        "property_label": "Type",
        "@value": "Libro"
      }
    ]
  }
]

// Datos de ejemplo para Strapi CMS
// POST /api/content

[
  {
    "titulo": "Acerca del Instituto",
    "contenido": "El Instituto de Investigaciones Sociales es una dependencia de la UNAM dedicada a la investigación en ciencias sociales.",
    "tipo": "pagina",
    "slug": "acerca-del-instituto"
  },
  {
    "titulo": "Últimas Noticias del Instituto",
    "contenido": "Recientes investigaciones y publicaciones del Instituto de Investigaciones Sociales.",
    "tipo": "seccion",
    "slug": "noticias"
  },
  {
    "titulo": "Recursos por Categoría",
    "contenido": "Accede a nuestros recursos organizados por categorías de investigación.",
    "tipo": "pagina",
    "slug": "categorias"
  }
]
