import Link from "next/link";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

export const metadata = {
  title: "Tietosuojaseloste | OmatJuhlat",
  description:
    "Tietoa siitä, miten OmatJuhlat käsittelee asiakkaiden ja palveluntarjoajien henkilötietoja.",
};

export default function PrivacyPage() {
  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
        <section className="relative overflow-hidden border-b border-[#e8ded0] bg-gradient-to-br from-[#fffdf9] via-[#fff7eb] to-[#f8e8e8]">
          <div
            aria-hidden="true"
            className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#ead8b8]/45 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#d9a8b8]/25 blur-3xl"
          />

          <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
            >
              <span aria-hidden="true">
                ←
              </span>

              Takaisin etusivulle
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#9a773b]">
              OmatJuhlat
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Tietosuojaseloste
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#70675e] sm:text-lg">
              Tässä selosteessa kerromme,
              mitä henkilötietoja OmatJuhlat
              käsittelee, miksi niitä
              tarvitaan ja millaisia
              oikeuksia sinulla on.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#91877d]">
              Päivitetty 25.7.2026
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="rounded-3xl border border-[#e2d5c4] bg-white p-6 shadow-[0_18px_50px_rgba(73,53,31,0.08)] sm:p-10">
            <PrivacySection title="1. Rekisterinpitäjä">
              <p>
                OmatJuhlat-palvelun
                rekisterinpitäjä on:
              </p>

              <div className="mt-4 rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5">
                <p className="font-bold">
                  OmatJuhlat / Vanosan
                  Jeyakulendran
                </p>

                <p className="mt-1">
                  Helsinki, Suomi
                </p>

                <a
                  href="mailto:tietosuoja@omatjuhlat.fi"
                  className="mt-2 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
                >
                  tietosuoja@omatjuhlat.fi
                </a>
              </div>

              <p className="mt-4">
                OmatJuhlat on tällä hetkellä
                startup-vaiheessa eikä vielä
                rekisteröity yritys.
                Rekisterinpitäjän tiedot
                päivitetään, kun toiminta
                siirtyy rekisteröidylle
                yritykselle.
              </p>
            </PrivacySection>

            <PrivacySection title="2. Mitä tietoja käsittelemme?">
              <p>
                Käsittelemme vain palvelun
                toteuttamisen kannalta
                tarpeellisia tietoja.
              </p>

              <h3 className="mt-5 font-bold text-[#3f362f]">
                Asiakkaiden tiedot
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  nimi, sähköpostiosoite ja
                  puhelinnumero
                </li>
                <li>
                  tapahtuman tyyppi,
                  päivämäärä, sijainti ja
                  vierasmäärä
                </li>
                <li>
                  pyydetyt palvelut,
                  kokonaisbudjetti ja
                  asiakkaan antamat
                  lisätiedot
                </li>
                <li>
                  tarjouspyynnöt,
                  vastaanotetut tarjoukset,
                  valinnat ja vahvistukset
                </li>
                <li>
                  asiakkaan ja
                  palveluntarjoajan välisen
                  yhteyden muodostamiseen
                  tarvittavat tiedot
                </li>
              </ul>

              <h3 className="mt-6 font-bold text-[#3f362f]">
                Palveluntarjoajien tiedot
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  yrityksen nimi,
                  yhteyshenkilö,
                  sähköposti ja puhelinnumero
                </li>
                <li>
                  yritysprofiilin tiedot,
                  palvelut, toiminta-alueet,
                  kuvat ja esittelytekstit
                </li>
                <li>
                  partnerihakemuksen ja
                  käyttäjätilin tiedot
                </li>
                <li>
                  tarjoukset, hinnat,
                  viestit, saatavuus ja
                  kalenterimerkinnät
                </li>
                <li>
                  palvelun käyttöön liittyvät
                  tila- ja tapahtumatiedot
                </li>
              </ul>

              <h3 className="mt-6 font-bold text-[#3f362f]">
                Tekniset tiedot
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  välttämättömät kirjautumis-
                  ja istuntotiedot
                </li>
                <li>
                  palvelimen lokitiedot sekä
                  virhe- ja
                  tietoturvatapahtumat
                </li>
                <li>
                  selaimen ja laitteen
                  teknisiä tietoja silloin,
                  kun niitä tarvitaan
                  palvelun turvallisuuden ja
                  toimivuuden varmistamiseen
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="3. Mihin tietoja käytetään?">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  tarjouspyyntöjen
                  vastaanottamiseen ja
                  välittämiseen sopiville
                  palveluntarjoajille
                </li>
                <li>
                  tarjousten laatimiseen,
                  vertailuun, valintaan ja
                  vahvistamiseen
                </li>
                <li>
                  asiakkaan ja valitun
                  palveluntarjoajan
                  yhteystietojen
                  välittämiseen
                </li>
                <li>
                  partnerihakemusten,
                  käyttäjätilien,
                  yritysprofiilien ja
                  saatavuuskalenterien
                  hallintaan
                </li>
                <li>
                  palveluun liittyvien
                  sähköpostien ja
                  ilmoitusten lähettämiseen
                </li>
                <li>
                  asiakaspalveluun,
                  väärinkäytösten estämiseen
                  ja palvelun
                  tietoturvallisuuden
                  ylläpitämiseen
                </li>
                <li>
                  palvelun kehittämiseen ja
                  teknisten ongelmien
                  selvittämiseen
                </li>
                <li>
                  lakisääteisten
                  velvollisuuksien
                  täyttämiseen
                </li>
              </ul>

              <p className="mt-4">
                Emme käytä yhteystietoja
                suoramarkkinointiin ilman
                erillistä siihen soveltuvaa
                perustetta tai suostumusta.
              </p>
            </PrivacySection>

            <PrivacySection title="4. Käsittelyn oikeusperusteet">
              <p>
                Henkilötietojen käsittely
                perustuu tilanteesta riippuen:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  palvelun tarjoamiseen ja
                  käyttäjän pyynnöstä ennen
                  sopimusta tehtäviin
                  toimenpiteisiin
                </li>
                <li>
                  OmatJuhlat-palvelun
                  oikeutettuun etuun ylläpitää
                  turvallista ja toimivaa
                  palvelua, ehkäistä
                  väärinkäytöksiä ja selvittää
                  palveluun liittyviä
                  ongelmia
                </li>
                <li>
                  käyttäjän suostumukseen
                  silloin, kun suostumus on
                  pyydetty erikseen
                </li>
                <li>
                  lakisääteiseen
                  velvollisuuteen silloin,
                  kun laki edellyttää tietojen
                  säilyttämistä tai
                  luovuttamista
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="5. Kenelle tietoja luovutetaan?">
              <p>
                Tarjouspyynnön tapahtuma- ja
                palvelutietoja voidaan
                näyttää niille
                palveluntarjoajille, joille
                pyyntö on kohdistettu tai
                jotka vastaavat asiakkaan
                valitsemia palveluita ja
                toiminta-aluetta.
              </p>

              <p className="mt-4">
                Asiakkaan varsinaiset
                yhteystiedot näytetään
                palveluntarjoajalle vasta,
                kun asiakas on hyväksynyt tai
                lopullisesti vahvistanut
                kyseisen palveluntarjoajan
                valinnan.
              </p>

              <p className="mt-4">
                Palveluntarjoajan profiili- ja
                tarjoustiedot näytetään
                asiakkaalle siinä laajuudessa
                kuin tarjousten vertailu ja
                palveluntarjoajan valinta
                edellyttävät.
              </p>

              <p className="mt-4">
                Tietoja voidaan luovuttaa
                viranomaiselle, jos
                sovellettava laki tai
                viranomaisen lainmukainen
                pyyntö sitä edellyttää.
              </p>

              <p className="mt-4">
                OmatJuhlat ei myy
                henkilötietoja ulkopuolisille.
              </p>
            </PrivacySection>

            <PrivacySection title="6. Palveluntarjoajat ja tietojen käsittelijät">
              <p>
                Palvelun toteuttamisessa
                käytetään seuraavia teknisiä
                palveluntarjoajia:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Supabase</strong> –
                  tietokanta,
                  käyttäjätunnistautuminen ja
                  tiedostojen säilytys
                </li>
                <li>
                  <strong>Vercel</strong> –
                  verkkopalvelun ylläpito ja
                  tekninen toimittaminen
                </li>
                <li>
                  <strong>Resend</strong> –
                  palveluun liittyvien
                  sähköpostien lähettäminen
                </li>
                <li>
                  <strong>Cloudflare</strong> –
                  DNS-palvelut,
                  verkkoliikenteen suojaus ja
                  sähköpostien
                  edelleenlähetys
                </li>
              </ul>

              <p className="mt-4">
                Palveluntarjoajat käsittelevät
                tietoja OmatJuhlat-palvelun
                puolesta omien
                sopimusehtojensa,
                tietosuojakäytäntöjensä ja
                sovellettavan
                tietosuojalainsäädännön
                mukaisesti.
              </p>
            </PrivacySection>

            <PrivacySection title="7. Tietojen siirtäminen EU- ja ETA-alueen ulkopuolelle">
              <p>
                Osa käyttämistämme teknisistä
                palveluntarjoajista voi
                käsitellä tietoja EU- tai
                ETA-alueen ulkopuolella.
                Tällöin tietojen siirtämisessä
                käytetään sovellettavan
                tietosuojalainsäädännön
                mukaisia suojatoimia, kuten
                Euroopan komission
                hyväksymiä
                vakiosopimuslausekkeita tai
                muuta hyväksyttyä
                siirtoperustetta.
              </p>
            </PrivacySection>

            <PrivacySection title="8. Tietojen säilyttäminen">
              <p>
                Henkilötietoja säilytetään vain
                niin kauan kuin niitä tarvitaan
                tässä selosteessa kuvattuihin
                tarkoituksiin.
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  vahvistamattomat ja
                  päättyneet tarjouspyynnöt
                  sekä hävinneet tarjoukset
                  poistetaan tai
                  anonymisoidaan
                  lähtökohtaisesti viimeistään
                  12 kuukauden kuluessa
                  tapahtumasta tai pyynnön
                  sulkemisesta
                </li>
                <li>
                  vahvistettuihin varauksiin
                  liittyviä tietoja
                  säilytetään lähtökohtaisesti
                  enintään 24 kuukautta
                  tapahtuman jälkeen
                </li>
                <li>
                  hylättyjä tai keskeytettyjä
                  partnerihakemuksia
                  säilytetään lähtökohtaisesti
                  enintään 12 kuukautta
                  päätöksestä
                </li>
                <li>
                  aktiivisen
                  palveluntarjoajan
                  käyttäjätilin tietoja
                  säilytetään tilin
                  voimassaolon ajan ja
                  tarpeellisten
                  jälkitoimenpiteiden ajan
                  tilin sulkemisen jälkeen
                </li>
                <li>
                  teknisiä lokitietoja
                  säilytetään lähtökohtaisesti
                  enintään 90 päivää, ellei
                  pidempi säilytys ole
                  tarpeen tietoturvatapahtuman
                  selvittämiseksi
                </li>
              </ul>

              <p className="mt-4">
                Tietoja voidaan säilyttää
                pidempään, jos laki,
                viranomaisvelvoite,
                kirjanpitovelvollisuus tai
                oikeusvaateen laatiminen,
                esittäminen tai puolustaminen
                sitä edellyttää.
              </p>
            </PrivacySection>

            <PrivacySection title="9. Tietojen suojaaminen">
              <p>
                Tietoja suojataan teknisin ja
                organisatorisin keinoin.
                Käytössä ovat muun muassa
                salatut HTTPS-yhteydet,
                henkilökohtaiset
                asiakaslinkit, käyttöoikeuksien
                rajaaminen,
                tietokantatason
                käyttöoikeussäännöt sekä
                suojattu partneri- ja
                admin-kirjautuminen.
              </p>

              <p className="mt-4">
                Salasanoja ei tallenneta
                OmatJuhlat-palvelun omaan
                tietokantaan selväkielisinä,
                vaan kirjautumisen käsittelee
                Supabase Auth.
              </p>
            </PrivacySection>

            <PrivacySection title="10. Evästeet, paikallinen tallennus ja analytiikka">
  <p>
    OmatJuhlat käyttää palvelun toiminnan, turvallisuuden ja
    kirjautumisen kannalta välttämättömiä evästeitä sekä selaimen
    paikallista tallennusta. Näiden käyttö ei edellytä erillistä
    suostumusta.
  </p>

  <p className="mt-4">
    Käyttäjän evästevalinta tallennetaan selaimen paikalliseen
    tallennukseen nimellä{" "}
    <code className="rounded bg-[#f4eee5] px-1.5 py-0.5">
      omatjuhlat-analytics-consent
    </code>
    . Tallennettu arvo kertoo, onko käyttäjä sallinut vai kieltänyt
    analytiikan.
  </p>

  <p className="mt-4">
    Käytämme käyttäjän suostumuksella Google Analytics 4 -palvelua
    ymmärtääksemme, miten OmatJuhlat-verkkosivustoa käytetään.
    Analytiikan avulla voimme käsitellä esimerkiksi tietoja
    katsotuista sivuista, vierityksistä, sivustolta poistuvien
    linkkien klikkauksista, laite- ja selaintyypistä sekä
    sivustolle saapumisen lähteestä.
  </p>

  <p className="mt-4">
    Google Analytics käynnistyy vasta, kun käyttäjä valitsee
    “Salli analytiikka”. Analytiikan käsittelyperusteena on
    käyttäjän suostumus. Mainontaan liittyvä tallennus,
    mainoskäyttäjätiedot ja personoitu mainonta on asetettu
    pois käytöstä.
  </p>

  <p className="mt-4">
    Google Analytics -palvelun tarjoaa Google Ireland Limited.
    Palvelun käytön yhteydessä tietoja voidaan käsitellä myös
    Euroopan unionin ja Euroopan talousalueen ulkopuolella
    asianmukaisia suojatoimia käyttäen.
  </p>

  <p className="mt-4">
    Käyttäjä voi muuttaa valintaansa milloin tahansa sivun
    vasemmassa alakulmassa olevasta “Evästeasetukset”-painikkeesta.
    Suostumuksen peruuttaminen estää uuden analytiikkatiedon
    keräämisen kyseisessä selaimessa.
  </p>

  <p className="mt-4">
    Lisätietoja Googlen tietojen käsittelystä löytyy{" "}
    <a
      href="https://policies.google.com/privacy"
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[#87652f] underline hover:text-[#5f451f]"
    >
      Googlen tietosuojakäytännöstä
    </a>
    .
  </p>
</PrivacySection>
            <PrivacySection title="11. Rekisteröidyn oikeudet">
              <p>
                Sinulla voi tilanteesta ja
                käsittelyperusteesta riippuen
                olla oikeus:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  saada tieto siitä,
                  käsittelemmekö
                  henkilötietojasi
                </li>
                <li>
                  tarkastaa sinusta
                  tallennetut tiedot
                </li>
                <li>
                  pyytää virheellisten tai
                  puutteellisten tietojen
                  korjaamista
                </li>
                <li>
                  pyytää tietojen poistamista
                </li>
                <li>
                  pyytää käsittelyn
                  rajoittamista
                </li>
                <li>
                  vastustaa oikeutettuun
                  etuun perustuvaa käsittelyä
                </li>
                <li>
                  saada itse toimittamasi
                  tiedot siirrettyä
                  järjestelmästä silloin, kun
                  oikeus soveltuu
                </li>
                <li>
                  peruuttaa antamasi
                  suostumus milloin tahansa
                </li>
              </ul>

              <p className="mt-4">
                Voit käyttää oikeuksiasi
                lähettämällä pyynnön
                osoitteeseen:
              </p>

              <a
                href="mailto:tietosuoja@omatjuhlat.fi"
                className="mt-2 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                tietosuoja@omatjuhlat.fi
              </a>

              <p className="mt-4">
                Voimme pyytää tarvittavia
                lisätietoja henkilöllisyytesi
                varmistamiseksi. Pyyntöihin
                vastataan ilman aiheetonta
                viivytystä ja lähtökohtaisesti
                kuukauden kuluessa.
              </p>
            </PrivacySection>

            <PrivacySection title="12. Oikeus tehdä valitus">
              <p>
                Jos katsot, että
                henkilötietojasi on käsitelty
                tietosuojasäännösten
                vastaisesti, voit ottaa ensin
                yhteyttä OmatJuhlat-palveluun.
                Sinulla on myös oikeus tehdä
                valitus valvontaviranomaiselle.
              </p>

              <a
                href="https://tietosuoja.fi/"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                Tietosuojavaltuutetun toimisto
                →
              </a>
            </PrivacySection>

            <PrivacySection title="13. Selosteen muutokset">
              <p>
                Tätä tietosuojaselostetta
                voidaan päivittää palvelun,
                lainsäädännön tai
                henkilötietojen
                käsittelytapojen muuttuessa.
                Ajantasainen versio julkaistaan
                tällä sivulla ja sen
                päivityspäivä ilmoitetaan
                sivun alussa.
              </p>
            </PrivacySection>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#eee5d9] py-8 first:pt-0 last:border-b-0 last:pb-0">
      <h2 className="text-2xl font-bold text-[#211b16]">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-[#62584f] sm:text-base">
        {children}
      </div>
    </section>
  );
}