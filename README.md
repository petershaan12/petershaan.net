<h1 align="center">
  petershaan.net — version 3
</h1>
<p align="center">
  <a href="https://github.com/petershaan12" alt="author">
    <img src="https://img.shields.io/badge/author-peter%20shaan-yellow.svg" /></a> </br>
  Portfolio, projects and blog of Peter Shaan, built with <a href="https://nextjs.org/" target="_blank">Next.js</a> and hosted on <a href="https://vercel.com/" target="_blank">Vercel</a>
</p>

> Ini arsip **version 3**. Website yang live sekarang (version 4) ada di [petershaan.net](https://petershaan.net). Lihat branch lain buat [version 1](https://github.com/petershaan12/petershaan.net/tree/version-1) dan [version 2](https://github.com/petershaan12/petershaan.net/tree/version-2-remix).

## 🚨 Tentang Repo ini (About This Repo)

Haii 👋 you can use this code for your own website, but please dont forget me for copyright 😊.

## 🛠 Fitur Website 3.0

1. Next.js 16 App Router + React 19 + TypeScript
2. Tailwind CSS v4 + shadcn/ui (Radix)
3. Konten blog, notes dan projects disimpan di MongoDB, diedit lewat CMS privat
4. MDX dikompilasi saat save (Shiki, rehype-slug, autolink)
5. Like & view counter, guestbook, subscribe + email notify (Nodemailer)
6. OG image dinamis, RSS, sitemap, JSON-LD
7. Upload gambar ke Vercel Blob
8. Animasi pakai Framer Motion + Lottie

## 🛠 Cara Menggunakan (How to Use)

```bash
git clone -b version-3 https://github.com/petershaan12/petershaan.net.git
cd petershaan.net
npm install
cp .example.env .env.local   # isi MONGODB_URI, EMAIL_USER, EMAIL_PASS, dll
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).
