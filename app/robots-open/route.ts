/** Satılan sitenin kendi alan adındaki robots.txt: kök açık, iç sayfalar kapalı. */
export function GET() {
  return new Response("User-Agent: *\nAllow: /\nDisallow: /panel\nDisallow: /giris\nDisallow: /api/\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
