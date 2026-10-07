# Product photos in production

The source catalog's photos are published as static WebP files in
`public/assets/catalog/`. Their content hashes form the filenames, allowing
immutable caching. `app/products/data/catalog-media.json` maps product families
to the published gallery; every pack size shares its family's photos.

The server catalog applies this manifest to listings and product detail pages.
The product index builder applies the same primary photo to the cart, wishlist,
checkout and search suggestions. Published photos are compressed before
deployment and served directly, without runtime image transformations.

After changing the source catalog or photos, run:

```sh
npm run import:catalog
npm run build:catalog-media
node scripts/build-product-index.mjs
npm run check:catalog-media
```

Commit the resulting manifest and WebP files with the catalog change. Normal
builds validate that every family has a published photo and that every referenced
file exists; they do not reprocess the source archive on Vercel. A source file
that fails to decode is skipped if its family has another usable photo. A family
with no usable photo fails generation and validation.

The development reference overlay remains available for local previews. It is
not needed for production photos. Original archive files remain retained in Git
and excluded from server-function bundles; the WebP files deploy as static assets.
