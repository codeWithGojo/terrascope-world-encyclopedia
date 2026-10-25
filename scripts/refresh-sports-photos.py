"""Download attributed Commons photos. Requires Pillow (python -m pip install Pillow)."""
import concurrent.futures, html, io, json, re, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "football-cover": "Association football", "basketball-cover": "Basketball", "cricket-cover": "Cricket", "tennis-cover": "Tennis",
    "michael-jordan": "Michael Jordan", "lebron-james": "LeBron James", "kobe-bryant": "Kobe Bryant", "hakeem-olajuwon": "Hakeem Olajuwon", "lisa-leslie": "Lisa Leslie", "lauren-jackson": "Lauren Jackson",
    "sachin-tendulkar": "Sachin Tendulkar", "don-bradman": "Don Bradman", "viv-richards": "Viv Richards", "brian-lara": "Brian Lara", "muttiah-muralitharan": "Muttiah Muralitharan", "mithali-raj": "Mithali Raj",
    "serena-williams": "Serena Williams", "roger-federer": "Roger Federer", "rafael-nadal": "Rafael Nadal", "novak-djokovic": "Novak Djokovic", "steffi-graf": "Steffi Graf", "naomi-osaka": "Naomi Osaka",
}
HEADERS = {"User-Agent": "TerraScope educational sports guide/1.0"}
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=30) as response:
        return response.read()
def query(host, values):
    return json.loads(get(host + "/w/api.php?" + urllib.parse.urlencode({"action": "query", "format": "json", **values})))
def plain(value):
    return html.unescape(re.sub(r"<[^>]*>", "", value)).strip()
def main():
    (ROOT / "public/sports").mkdir(parents=True, exist_ok=True)
    (ROOT / "app/sports").mkdir(parents=True, exist_ok=True)
    pages = query("https://en.wikipedia.org", {"titles": "|".join(PAGES.values()), "prop": "pageimages", "piprop": "name", "redirects": "1"})["query"]
    files = {p["title"]: "File:" + p["pageimage"] for p in pages["pages"].values() if p.get("pageimage")}
    for redirect in pages.get("redirects", []):
        if redirect["to"] in files: files[redirect["from"]] = files[redirect["to"]]
    info = query("https://commons.wikimedia.org", {"titles": "|".join(files.values()), "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": "1000"})["query"]["pages"]
    by_file = {p["title"].replace("_", " "): p.get("imageinfo", [None])[0] for p in info.values()}
    output = {}
    def download(pair):
        slug, title = pair; data = by_file.get(files.get(title, "").replace("_", " "))
        if not data: return slug, None
        meta = data.get("extmetadata", {})
        license_name = plain(meta.get("LicenseShortName", {}).get("value", ""))
        if not (license_name.startswith("CC BY") or license_name in ["Public domain", "CC0", "PDM", "GODL-India"]): return slug, None
        image_url = data.get("thumburl") or data["url"]
        path = ROOT / "public/sports" / (slug + ".webp")
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(get(image_url)))).convert("RGB")
        image.thumbnail((1000, 800) if slug.endswith("-cover") else (640, 800))
        image.save(path, "WEBP", quality=82, method=6)
        return slug, {"src": "/sports/" + path.name, "alt": title, "author": plain(meta.get("Artist", {}).get("value", "Wikimedia Commons contributor")), "license": license_name, "licenseUrl": meta.get("LicenseUrl", {}).get("value", ""), "source": data["descriptionurl"]}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        for slug, item in executor.map(download, PAGES.items()):
            if item: output[slug] = item
    (ROOT / "app/sports/photos.json").write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"downloaded": len(output), "missing": [key for key in PAGES if key not in output]}))
if __name__ == "__main__": main()
