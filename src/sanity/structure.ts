import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('dorm').title('Dorms'),
      S.documentTypeListItem('flexibleContent').title('Flexible Content'),
      S.documentTypeListItem('highlightCard').title('Highlight Card'),
      S.documentTypeListItem('gallery').title('Gallery'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'dorm', 'flexibleContent', 'highlightCard', 'gallery'].includes(item.getId()!),
      ),
    ])