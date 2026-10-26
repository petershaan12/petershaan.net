<p align="center">
  <img src="public/favicon.png" alt="petershaan.net logo" width="96" />
</p>

<h1 align="center">petershaan.net, version 1</h1>

<p align="center">
  The first version of the personal portfolio and blog of <a href="https://github.com/petershaan12">Peter Shaan</a>, built with Next.js and Tailwind CSS.<br />
  This is an archived version. The live site is <a href="https://petershaan.net">petershaan.net</a>, and all versions are listed in the <a href="https://github.com/petershaan12/petershaan.net/tree/version-3"><code>version-3</code></a> branch.
</p>

## Screenshot

![Home](docs/screenshots/home.png)

## Features

- Next.js 14 App Router (JavaScript)
- Tailwind CSS with a light and dark theme (`next-themes`)
- Projects, tools and blog pages
- Post likes with [Lyket](https://lyket.dev)
- Firebase integration

The design is inspired by [fahreziadha.com](https://fahreziadha.com), but the code is written from scratch.

## Run it locally

Requirements: Node.js 18+.

```bash
git clone -b version-1 https://github.com/petershaan12/petershaan.net.git
cd petershaan.net
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs without any configuration. Likes and Firebase only work if you add these to `.env.local`:

```bash
NEXT_PUBLIC_LYKET_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Production build:

```bash
npm run build
npm start
```

## License

Feel free to use this code for your own website, but please credit me and do not copy my personal content (text, photos, posts).
