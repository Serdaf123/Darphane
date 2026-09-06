import { sectionId } from "@/lib/actions";
import type { Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";
import { About } from "./About";
import { Contact } from "./Contact";
import { Cta } from "./Cta";
import { Faq } from "./Faq";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { HoursSection } from "./HoursSection";
import { Location } from "./Location";
import { Menu } from "./Menu";
import { Reviews } from "./Reviews";
import { Services } from "./Services";
import { Pricing } from "./Pricing";
import { Team } from "./Team";
import { BeforeAfter } from "./BeforeAfter";

/**
 * JSON'daki sections dizisi sayfayı belirler.
 * Yeni bir bölüm tipi eklemek = şemaya bir varyant + buraya bir satır.
 */
export function Sections({
  sections,
  business,
  locale = "tr",
}: {
  sections: Section[];
  business: Business;
  locale?: Locale;
}) {
  return (
    <>
      {sections.map((section, index) => {
        const id = sectionId(section, index);
        const key = `${section.type}-${index}`;

        switch (section.type) {
          case "hero":
            return <Hero key={key} section={section} business={business} id={id} locale={locale} />;
          case "about":
            return <About key={key} section={section} id={id} />;
          case "services":
            return <Services key={key} section={section} id={id} />;
          case "menu":
            return <Menu key={key} section={section} id={id} />;
          case "gallery":
            return <Gallery key={key} section={section} id={id} />;
          case "reviews":
            return <Reviews key={key} section={section} id={id} locale={locale} />;
          case "hours":
            return <HoursSection key={key} section={section} business={business} id={id} locale={locale} />;
          case "location":
            return <Location key={key} section={section} business={business} id={id} locale={locale} />;
          case "contact":
            return <Contact key={key} section={section} business={business} id={id} locale={locale} />;
          case "faq":
            return <Faq key={key} section={section} id={id} />;
          case "pricing":
            return <Pricing key={key} section={section} business={business} id={id} locale={locale} />;
          case "team":
            return <Team key={key} section={section} id={id} />;
          case "beforeAfter":
            return <BeforeAfter key={key} section={section} id={id} locale={locale} />;
          case "cta":
            return <Cta key={key} section={section} business={business} id={id} locale={locale} />;
        }
      })}
    </>
  );
}
