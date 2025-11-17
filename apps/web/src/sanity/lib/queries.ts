import { defineQuery } from 'next-sanity';

export const HOMEPAGE_EVENTS_QUERY = defineQuery(`*[
  _type == "event"
  && defined(slug.current)
  && date > now()
]|order(date asc){_id, name, slug, date}`);

export const EVENT_QUERY = defineQuery(`*[
    _type == "event" &&
    slug.current == $slug
  ][0]{
  ...,
  "date": coalesce(date, now()),
  "doorsOpen": coalesce(doorsOpen, 0),
  headline->,
  venue->
}`);

export const PAGE_BUILDER_TYPES_ARRAY = defineQuery(
  `*[_type == 'page'].pageBuilder[]{
  _type
}`
);

export const PAGE_BUILDER_QUERY =
  defineQuery(`*[_type == 'page' && slug.current == $slug][0]{
  _id,
  _type,
  pageBuilder[]{
    ...,
    _type,
    _type == 'hero' => {
      title,
      text,
      "image": image
    },
    _type == 'gallery' => {
      title,
      "image": image
    },
    _type == 'organisers' => {
      title,
      "image": image
    },
    _type == 'review' => {
      title,
      review,
    }
  }
}`);
