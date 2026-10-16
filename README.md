# Kuhaj z mano

Spletna stran kuhajzmano.com, prenesena z Bloggerja na GitHub Pages (Jekyll).

## Objava na GitHub (prvič)

1. Namesti **GitHub Desktop** (desktop.github.com) in se prijavi s svojim GitHub računom.
2. V GitHub Desktop: **File → New repository**. Ime: `kuhajzmano`. Izberi mapo na računalniku in klikni **Create repository**.
3. Vsebino te mape (vse datoteke iz zipa, tudi skrito mapo `.github`) kopiraj v novo mapo repozitorija.
4. V GitHub Desktop vpiši opis (npr. »Prva verzija«), klikni **Commit to main**, nato **Publish repository**. Odkljukaj **Keep this code private**, ker GitHub Pages v brezplačni verziji deluje samo z javnimi repozitoriji.
5. **Settings → Pages**: pri *Source* izberi **Deploy from a branch**, veja **main**, mapa **/ (root)** → **Save**.
6. Čez 2–5 minut je stran na `https://graicevic123.github.io/kuhajzmano/`.

## Prenos slik z Bloggerja

Na začetku se slike še nalagajo z Bloggerja, zato bloga ne briši, dokler tega koraka ne opraviš.

1. Na github.com odpri zavihek **Actions** → na levi **Prenesi slike** → **Run workflow**.
2. Postopek traja približno 30–60 minut. Slike prenese, pomanjša, pretvori v WebP in popravi povezave v vseh objavah. Nato se stran sama posodobi.
3. Če se ustavi z napako o dovoljenjih: **Settings → Actions → General → Workflow permissions → Read and write permissions** in ga zaženi znova. Že prenesene slike preskoči.

## Povezava domene kuhajzmano.com

Ko imaš spet dostop do domene:

1. V `_config.yml` nastavi `url: "https://www.kuhajzmano.com"` in `baseurl: ""`.
2. **Settings → Pages → Custom domain**: vpiši `www.kuhajzmano.com` → **Save**.
3. Pri registrarju domene (GoDaddy) nastavi DNS:
   - CNAME zapis `www` → `graicevic123.github.io`
   - štiri A zapise za `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Ko DNS začne delovati (do 24 ur), v **Settings → Pages** obkljukaj **Enforce HTTPS**.

Stari naslovi receptov (npr. `/2015/02/tenstan-krompir.html`) ostanejo enaki, zato vse obstoječe povezave in Google zadetki delujejo naprej.

## Nov recept

V mapo `_posts` dodaj datoteko z imenom `LLLL-MM-DD-ime-recepta.html`, npr. `2026-10-20-bucna-juha.html`:

```
---
layout: post
title: "Bučna juha"
date: 2026-10-20 12:00:00 +0200
kategorije: ["Juhe"]
slika: "/assets/slike/2026/bucna-juha-1.webp"
opis: "Kratek opis za Google in deljenje."
porcije: 4
cas: "30 min"
recept: true
sestavine: ["1 buča", "1 čebula"]
koraki: ["Bučo olupimo ...", "..."]
---
<p>Uvodno besedilo.</p>
<h2 class="r-sestavine">Sestavine</h2>
<ul class="sestavine">
<li>1 buča</li>
<li>1 čebula</li>
</ul>
<h2 class="r-priprava">Priprava</h2>
<p>Bučo olupimo ...</p>
<figure><img src="{{ site.baseurl }}/assets/slike/2026/bucna-juha-2.webp" alt="" loading="lazy"></figure>
```

Slike daj v `assets/slike/LETO/`. `porcije` in `cas` sta neobvezna: s `porcije` se na strani prikaže izbira števila porcij, ki preračuna količine.

## Kaj je kje

- `_posts/` – vseh 387 objav z Bloggerja
- `_layouts/`, `_includes/` – predloge strani
- `assets/css/main.css`, `assets/js/main.js` – izgled in delovanje (kljukice pri sestavinah, porcije, iskanje)
- `assets/logo/` – logotip (SVG in PNG)
- `kategorija/` – strani kategorij
- `o-meni/index.md` – stran O meni (dopolni besedilo)
