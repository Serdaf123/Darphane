import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik ve çerezler — fourpear",
  robots: { index: false, follow: false },
};

/**
 * KVKK aydınlatma metni (taslak). Hukuki gözden geçirme gerekir; şirket unvanı,
 * adres ve veri sorumlusu bilgisi Serkan'dan gelince tamamlanacak.
 */
export default function GizlilikPage() {
  return (
    <main style={{ maxWidth: "42rem", margin: "0 auto", padding: "3rem 1.5rem 5rem", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.65, color: "#17171b" }}>
      <h1 style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Gizlilik ve çerez aydınlatma metni</h1>
      <p>
        Bu sayfa, fourpear (Serkan Oral) tarafından hazırlanan ve barındırılan web sitelerinde ziyaretçi verilerinin nasıl işlendiğini
        6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında açıklar.
      </p>
      <h2>Hangi veriler, neden</h2>
      <ul>
        <li>
          <strong>Ziyaret istatistikleri</strong> (açılan bölümler, kaydırma derinliği, tıklanan düğmeler, ziyaret süresi, tarayıcı ve cihaz türü).
          Amaç: sitenin işe yarayıp yaramadığını ölçmek ve iyileştirmek. Yalnız çerez onayı verildiğinde toplanır.
        </li>
        <li>
          <strong>Oturum kaydı</strong>: sayfa üzerindeki hareketlerin anonimleştirilmiş kaydı. Form alanlarına yazılanlar ve telefon numaraları
          maskelenir; kayda girmez. Yalnız onayla başlar.
        </li>
        <li>
          <strong>Teknik günlükler</strong>: barındırma sağlayıcısı (Vercel) tarafından güvenlik ve hata ayıklama için tutulan IP adresi ve istek
          bilgileri. Onaya bağlı değildir; meşru menfaat kapsamındadır.
        </li>
      </ul>
      <h2>Kimlerle paylaşılır</h2>
      <p>
        İstatistik ve oturum kaydı için PostHog (Avrupa Birliği sunucuları) kullanılır. Veriler reklam amacıyla üçüncü kişilere satılmaz ya da
        devredilmez. WhatsApp ve telefon bağlantıları sizi doğrudan işletmeye yönlendirir; bu görüşmeler ilgili uygulamanın kendi kurallarına tabidir.
      </p>
      <h2>Çerezler</h2>
      <p>
        Onay tercihiniz tarayıcınızda 6 ay saklanır. İstatistik çerezleri yalnız &ldquo;Kabul&rdquo; dediğinizde yerleşir; &ldquo;Reddet&rdquo;
        derseniz hiçbir istatistik çerezi kullanılmaz. Tercihinizi tarayıcı verilerini temizleyerek sıfırlayabilirsiniz.
      </p>
      <h2>Haklarınız</h2>
      <p>
        KVKK’nın 11. maddesi kapsamında verilerinize erişme, düzeltilmesini ya da silinmesini isteme hakkınız vardır. Talepleriniz için
        WhatsApp üzerinden 0507 846 39 29 numarasına ya da sitenin iletişim bölümündeki kanallara yazabilirsiniz.
      </p>
      <p style={{ color: "#6c6c78", fontSize: "0.875rem" }}>Son güncelleme: Eylül 2026. Veri sorumlusu bilgileri tamamlanacaktır.</p>
    </main>
  );
}
