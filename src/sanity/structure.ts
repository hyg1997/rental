import { type StructureResolver } from 'sanity/structure'

export const myStructure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuracion General')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('equipo').title('Equipos'),
      S.documentTypeListItem('banner').title('Banners Hero'),
      S.documentTypeListItem('post').title('Articulos del Blog'),
      S.documentTypeListItem('pagina').title('Paginas'),
      S.divider(),
      S.documentTypeListItem('reclamo').title('Reclamos Recibidos'),
    ])
