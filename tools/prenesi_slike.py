"""Prenese vse slike z Bloggerja, jih pomanjša, pretvori v WebP in popravi povezave v objavah.
Zaženi prek GitHub Actions (zavihek Actions -> Prenesi slike) ali lokalno: python tools/prenesi_slike.py
Skripto lahko varno zaženeš večkrat: že prenesene slike preskoči."""
import os, re, io, glob, time
from concurrent.futures import ThreadPoolExecutor
import requests
from PIL import Image, ImageOps

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL_RE = re.compile(r'https?://[^"\s]*(?:googleusercontent\.com|bp\.blogspot\.com)[^"\s]*')
SIRINA, SIRINA_MALA, KAKOVOST = 1600, 800, 80

def prenesi(url, cilj, mala=None):
    if os.path.exists(cilj) and (not mala or os.path.exists(mala)):
        return True
    for poskus in range(4):
        try:
            r = requests.get(url, timeout=60)
            r.raise_for_status()
            im = ImageOps.exif_transpose(Image.open(io.BytesIO(r.content))).convert('RGB')
            os.makedirs(os.path.dirname(cilj), exist_ok=True)
            v = im.copy(); v.thumbnail((SIRINA, SIRINA * 3)); v.save(cilj, 'WEBP', quality=KAKOVOST, method=6)
            if mala:
                m = im.copy(); m.thumbnail((SIRINA_MALA, SIRINA_MALA * 3)); m.save(mala, 'WEBP', quality=KAKOVOST - 4, method=6)
            return True
        except Exception as e:
            napaka = e; time.sleep(2 * (poskus + 1))
    print('NAPAKA', url, napaka)
    return False

def main():
    opravila, objave = [], []
    for pot in sorted(glob.glob(os.path.join(KOREN, '_posts', '*.html'))):
        besedilo = open(pot, encoding='utf-8').read()
        _, glava, telo = besedilo.split('---', 2)
        ime = os.path.basename(pot)[:-5]            # 2015-02-10-tenstan-krompir
        leto, slug = ime[:4], ime[11:]
        urls = list(dict.fromkeys(URL_RE.findall(glava + telo)))
        slika = re.search(r'^slika: "([^"]+)"', glava, re.M)
        naslovna = slika.group(1) if slika else None
        zamenjave = {}
        for i, u in enumerate(urls, 1):
            rel = f'assets/slike/{leto}/{slug}-{i}.webp'
            mala = f'assets/slike/{leto}/{slug}-{i}-mala.webp' if u == naslovna else None
            zamenjave[u] = (rel, mala)
            opravila.append((u, os.path.join(KOREN, rel), os.path.join(KOREN, mala) if mala else None))
        objave.append((pot, glava, telo, zamenjave, naslovna))
    print(f'Slik za prenos: {len(opravila)}')
    with ThreadPoolExecutor(8) as ex:
        uspeh = dict(zip([o[0] for o in opravila], ex.map(lambda o: prenesi(*o), opravila)))
    for pot, glava, telo, zamenjave, naslovna in objave:
        for u, (rel, mala) in zamenjave.items():
            if not uspeh.get(u):
                continue
            telo = telo.replace(u, '{{ site.baseurl }}/' + rel)
            glava = glava.replace(f'"{u}"', f'"/{rel}"')
            if mala and 'slika_mala:' not in glava:
                glava = glava.rstrip('\n') + f'\nslika_mala: "/{mala}"\n'
        open(pot, 'w', encoding='utf-8').write('---' + glava + '---' + telo)
    print('Neuspešnih:', sum(1 for v in uspeh.values() if not v))

if __name__ == '__main__':
    main()
