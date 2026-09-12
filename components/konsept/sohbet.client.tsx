"use client";

import { useId, useState } from "react";

/**
 * Alttaki yazı kutusu. Yazılan metin wa.me bağlantısına önceden doldurulur; "Gönder" bir
 * bağlantıdır (JS kapalıysa bile varsayılan metinle açılır). WhatsApp yoksa yalnız "Ara".
 */
export function SohbetComposer({
  number,
  defaultText,
  telHref,
  phone,
}: {
  number?: string;
  defaultText?: string;
  telHref?: string;
  phone?: string;
}) {
  const id = useId();
  const [text, setText] = useState(defaultText ?? "");

  if (!number) {
    if (!telHref) return null;
    return (
      <div className="composer only-call">
        <p>Bu işletmeye WhatsApp&apos;tan değil, telefonla ulaşılıyor.</p>
        <a href={telHref} className="send">
          Ara{phone ? ` · ${phone}` : ""}
        </a>
      </div>
    );
  }

  const href = `https://wa.me/${number}${text.trim() ? `?text=${encodeURIComponent(text)}` : ""}`;

  return (
    <div className="composer">
      <label htmlFor={id} className="sr">
        Mesajınız
      </label>
      <textarea
        id={id}
        name="text"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Mesaj yazın"
        autoComplete="off"
      />
      <a href={href} target="_blank" rel="noopener noreferrer" className="send">
        Gönder
      </a>
      <p className="hint">Gönder, yazdığınızı WhatsApp&apos;ta açar.</p>
    </div>
  );
}
