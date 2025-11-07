import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'first-published',
      event: {
        includeAllVersions: true,
        on: ['create', 'update'],
        filter: '_type == "event" && !defined(firstPublished)',
      },
    }),
    defineDocumentFunction({
      name: 'details-script',
      src: 'functions/details-script',
      event: {
        includeAllVersions: true,
        on: ['create', 'update'],
        filter: '_type == "event" && defined(headline) && defined(venue) && !defined(details)',
        projection: '{_id, "headline": headline->{name}, "venue": venue->{name}}',
      },
    }),
  ],
})
