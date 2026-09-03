"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useState } from "react";
import { normalizePhone, whatsappUrl } from "@/lib/actions";
import type { Business, Section } from "@/lib/schema";

type ContactData = Extract<Section, { type: "contact" }>;

/**
 * Form gönderimi backend gerektirmez: alanlar tek bir metne çevrilip
 * WhatsApp'a önceden doldurulmuş mesaj olarak açılır.
 * Sunucu, mail servisi, spam ve KVKK'lı veri saklama derdi yok.
 */
export function Contact({
  section,
  business,
  id,
}: {
  section: ContactData;
  business: Business;
  id: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const target = business.whatsapp ?? business.phone;
  const fields = section.form.fields;
  const formEnabled = section.form.enabled && fields.length > 0 && Boolean(target);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;

    const lines = fields
      .map((field) => {
        const value = values[field.name]?.trim();
        return value ? `${field.label}: ${value}` : null;
      })
      .filter(Boolean);

    const message = [`${business.name} — web sitesi üzerinden mesaj`, "", ...lines].join("\n");
    window.open(whatsappUrl(target, message), "_blank", "noopener,noreferrer");
  }

  return (
    <section id={id} className="section">
      <Reveal className="container grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}

          <dl className="flex flex-col gap-3 text-[0.9375rem]">
            {business.phone ? (
              <div className="flex gap-2">
                <dt className="muted w-24 shrink-0">Telefon</dt>
                <dd className="m-0">
                  <a href={`tel:${normalizePhone(business.phone)}`} style={{ color: "inherit" }}>
                    {business.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {business.email ? (
              <div className="flex gap-2">
                <dt className="muted w-24 shrink-0">E-posta</dt>
                <dd className="m-0">
                  <a href={`mailto:${business.email}`} style={{ color: "inherit" }}>
                    {business.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {business.address ? (
              <div className="flex gap-2">
                <dt className="muted w-24 shrink-0">Adres</dt>
                <dd className="m-0">
                  {[business.address, business.district, business.city]
                    .filter(Boolean)
                    .join(", ")}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {formEnabled ? (
          <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.name} className="field">
                <label htmlFor={`${id}-${field.name}`}>
                  {field.label}
                  {field.required ? <span aria-hidden> *</span> : null}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={`${id}-${field.name}`}
                    name={field.name}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`${id}-${field.name}`}
                    name={field.name}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                  >
                    <option value="">Seçiniz</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`${id}-${field.name}`}
                    name={field.name}
                    type={field.type}
                    inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : undefined}
                    autoComplete={
                      field.type === "tel"
                        ? "tel"
                        : field.type === "email"
                          ? "email"
                          : /ad|isim|name/i.test(field.name)
                            ? "name"
                            : "off"
                    }
                    spellCheck={field.type === "email" ? false : undefined}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                  />
                )}
              </div>
            ))}

            <button type="submit" className="btn btn-primary mt-1">
              {section.form.submitLabel}
            </button>
            <p className="muted text-xs">
              Gönder&apos;e bastığınızda mesajınız WhatsApp&apos;ta hazır olarak açılır.
            </p>
          </form>
        ) : null}
      </Reveal>
    </section>
  );
}
