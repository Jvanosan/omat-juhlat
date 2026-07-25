import Link from "next/link";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

export const metadata = {
  title: "Käyttöehdot | OmatJuhlat",
  description:
    "OmatJuhlat-palvelun käyttöehdot asiakkaille ja palveluntarjoajille.",
};

export default function TermsPage() {
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
              Käyttöehdot
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#70675e] sm:text-lg">
              Nämä ehdot koskevat
              OmatJuhlat-palvelun käyttöä
              asiakkaana tai
              palveluntarjoajana.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#91877d]">
              Voimassa 25.7.2026 alkaen
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-8 rounded-3xl border border-[#ead29d] bg-[#fff8e8] p-6 text-sm leading-7 text-[#795a28] sm:p-8 sm:text-base">
            <p className="font-bold">
              OmatJuhlat toimii
              välityspalveluna.
            </p>

            <p className="mt-2">
              Varsinainen juhlapalvelua
              koskeva sopimus, maksaminen,
              peruutusehdot ja palvelun
              toteutus sovitaan suoraan
              asiakkaan ja valitun
              palveluntarjoajan välillä.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e2d5c4] bg-white p-6 shadow-[0_18px_50px_rgba(73,53,31,0.08)] sm:p-10">
            <TermsSection title="1. Palveluntarjoaja ja yhteystiedot">
              <p>
                OmatJuhlat-verkkopalvelua
                ylläpitää:
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
                  href="mailto:info@omatjuhlat.fi"
                  className="mt-2 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
                >
                  info@omatjuhlat.fi
                </a>
              </div>

              <p className="mt-4">
                OmatJuhlat on tällä hetkellä
                startup- ja
                pilotointivaiheessa eikä
                vielä rekisteröity yritys.
                Tiedot päivitetään, kun
                toiminta siirtyy
                rekisteröidylle yritykselle.
              </p>
            </TermsSection>

            <TermsSection title="2. Ehtojen soveltaminen ja hyväksyminen">
              <p>
                Näitä käyttöehtoja sovelletaan
                OmatJuhlat-verkkosivuston,
                tarjouspyyntöpalvelun,
                partneriportaalin,
                yritysprofiilien ja muiden
                palveluun kuuluvien
                ominaisuuksien käyttöön.
              </p>

              <p className="mt-4">
                Käyttämällä palvelua,
                lähettämällä
                tarjouspyynnön,
                partnerihakemuksen tai
                tarjouksen taikka
                vahvistamalla
                palveluntarjoajan valinnan
                käyttäjä hyväksyy nämä ehdot.
              </p>

              <p className="mt-4">
                Palvelun käyttäjän tulee olla
                vähintään 18-vuotias tai
                käyttää palvelua
                täysi-ikäisen huoltajan
                suostumuksella. Yrityksen
                puolesta toimivan henkilön
                tulee olla oikeutettu
                edustamaan kyseistä yritystä.
              </p>
            </TermsSection>

            <TermsSection title="3. OmatJuhlat-palvelun rooli">
              <p>
                OmatJuhlat tarjoaa teknisen
                palvelun, jonka kautta
                asiakkaat voivat:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  lähettää juhlapalveluita
                  koskevia tarjouspyyntöjä
                </li>
                <li>
                  vastaanottaa ja vertailla
                  palveluntarjoajien
                  tarjouksia
                </li>
                <li>
                  selata julkisia
                  yritysprofiileja
                </li>
                <li>
                  valita ja vahvistaa
                  palveluntarjoajia
                </li>
              </ul>

              <p className="mt-4">
                Palveluntarjoajat voivat
                vastaanottaa niille
                kohdistettuja
                tarjouspyyntöjä, lähettää
                tarjouksia, hallita
                yritysprofiiliaan ja
                saatavuuttaan sekä saada
                asiakkaan yhteystiedot
                hyväksytyn tai vahvistetun
                valinnan jälkeen.
              </p>

              <p className="mt-4">
                OmatJuhlat ei lähtökohtaisesti
                ole asiakkaan ja
                palveluntarjoajan välisen
                juhlapalvelusopimuksen
                osapuoli eikä itse toteuta
                tarjouksissa kuvattuja
                juhlapalveluita.
              </p>
            </TermsSection>

            <TermsSection title="4. Asiakkaan velvollisuudet">
              <p>
                Asiakas vastaa siitä, että
                hänen antamansa tiedot ovat
                oikeita, ajantasaisia ja
                riittäviä tarjouksen
                laatimista varten.
              </p>

              <p className="mt-4">
                Asiakas sitoutuu:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  antamaan oikean
                  sähköpostiosoitteen ja muut
                  tarvittavat yhteystiedot
                </li>
                <li>
                  ilmoittamaan
                  tapahtumapäivän,
                  paikkakunnan,
                  vierasmäärän ja
                  palvelutarpeen
                  mahdollisimman tarkasti
                </li>
                <li>
                  olemaan lähettämättä
                  lainvastaista, harhaanjohtavaa
                  tai asiatonta sisältöä
                </li>
                <li>
                  käyttämään henkilökohtaista
                  tarjouslinkkiä huolellisesti
                  ja olemaan jakamatta sitä
                  tarpeettomasti
                </li>
                <li>
                  tarkistamaan tarjouksen
                  hinnan, sisällön,
                  voimassaolon ja ehdot ennen
                  valintaa
                </li>
                <li>
                  sopimaan lopulliset
                  palveluehdot suoraan
                  palveluntarjoajan kanssa
                </li>
              </ul>
            </TermsSection>

            <TermsSection title="5. Palveluntarjoajan velvollisuudet">
              <p>
                Palveluntarjoaja vastaa
                yrityksestään,
                yritysprofiilistaan,
                tarjouksistaan ja
                toteuttamistaan palveluista.
              </p>

              <p className="mt-4">
                Palveluntarjoaja sitoutuu:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  antamaan oikeat ja
                  ajantasaiset yritys- ja
                  yhteystiedot
                </li>
                <li>
                  käyttämään vain kuvia,
                  tekstejä ja muuta sisältöä,
                  joihin sillä on tarvittavat
                  oikeudet
                </li>
                <li>
                  ilmoittamaan tarjouksen
                  kokonaishinnan ja sisällön
                  selkeästi
                </li>
                <li>
                  ilmoittamaan tarjouksen
                  voimassaoloajan ja
                  mahdolliset rajoitukset
                </li>
                <li>
                  ylläpitämään
                  saatavuuskalenterinsa
                  mahdollisimman
                  ajantasaisena
                </li>
                <li>
                  olemaan lähettämättä
                  tarjousta, jota se ei
                  kohtuudella pysty
                  toteuttamaan
                </li>
                <li>
                  ottamaan valinnan jälkeen
                  yhteyttä asiakkaaseen ilman
                  aiheetonta viivytystä
                </li>
                <li>
                  noudattamaan toimintaansa
                  sovellettavia lakeja,
                  lupavaatimuksia,
                  turvallisuusmääräyksiä ja
                  kuluttajansuojasäännöksiä
                </li>
              </ul>
            </TermsSection>

            <TermsSection title="6. Tarjouspyynnöt ja tarjoukset">
              <p>
                Tarjouspyynnön lähettäminen ei
                takaa, että asiakas saa yhden
                tai useamman tarjouksen.
                Tarjousten määrä riippuu muun
                muassa tapahtumapäivästä,
                sijainnista,
                palveluntarjoajien
                saatavuudesta ja pyydetyistä
                palveluista.
              </p>

              <p className="mt-4">
                Palveluntarjoajan lähettämä
                tarjous perustuu asiakkaan
                tarjouspyynnössä antamiin
                tietoihin. Jos tapahtuman
                tiedot muuttuvat,
                palveluntarjoajalla voi olla
                oikeus päivittää tarjousta tai
                ilmoittaa, ettei se pysty
                toteuttamaan palvelua.
              </p>

              <p className="mt-4">
                Tarjouksen voimassaolo päättyy
                tarjouksessa ilmoitettuna
                ajankohtana. Vanhentunutta
                tarjousta ei voi valita
                palvelussa.
              </p>
            </TermsSection>

            <TermsSection title="7. Valinta ja lopullinen vahvistaminen">
              <p>
                Kategoriatarjouspyynnössä
                asiakkaan tekemä alustava
                valinta voidaan vaihtaa tai
                poistaa ennen lopullista
                vahvistamista.
              </p>

              <p className="mt-4">
                Lopullisen vahvistamisen
                yhteydessä palvelu tarkistaa
                palveluntarjoajan
                saatavuuden. Jos
                palveluntarjoaja on ehtinyt
                varautua samalle päivälle,
                valintaa ei voida vahvistaa
                ja asiakasta pyydetään
                valitsemaan toinen
                palveluntarjoaja.
              </p>

              <p className="mt-4">
                Lopullisen vahvistamisen
                jälkeen asiakkaan ja valitun
                palveluntarjoajan
                yhteystiedot välitetään
                osapuolille. Valintaa ei
                tämän jälkeen voi muuttaa
                OmatJuhlat-palvelussa.
              </p>

              <p className="mt-4">
                Suorassa tarjouspyynnössä
                asiakkaan hyväksyntä voi olla
                heti lopullinen valinta, minkä
                jälkeen yhteystiedot
                välitetään osapuolille.
              </p>
            </TermsSection>

            <TermsSection title="8. Sopimus, maksaminen ja peruutukset">
              <p>
                Varsinainen juhlapalvelua
                koskeva sopimus syntyy
                asiakkaan ja
                palveluntarjoajan välillä
                heidän sopimallaan tavalla.
              </p>

              <p className="mt-4">
                Palvelun sisältö,
                maksuaikataulu,
                ennakkomaksut,
                peruutusehdot,
                muutosehdot,
                vahingonkorvaukset ja muut
                sopimusehdot tulee sopia
                suoraan palveluntarjoajan
                kanssa.
              </p>

              <p className="mt-4">
                OmatJuhlat ei tällä hetkellä
                vastaanota asiakkaan ja
                palveluntarjoajan välisiä
                maksuja eikä säilytä heidän
                maksukortti- tai
                pankkitietojaan.
              </p>

              <p className="mt-4">
                Pakottavaan
                kuluttajansuojalainsäädäntöön
                perustuvia oikeuksia ei
                rajoiteta näillä ehdoilla.
                Peruuttamisoikeuden
                soveltuminen ja
                peruutuksesta mahdollisesti
                perittävä maksu määräytyvät
                asiakkaan ja
                palveluntarjoajan välisen
                sopimuksen sekä sovellettavan
                lain perusteella.
              </p>
            </TermsSection>

            <TermsSection title="9. Saatavuus ja päällekkäiset valinnat">
              <p>
                Palveluntarjoajan alustava
                valinta ei yksin takaa
                varausta ennen lopullista
                vahvistamista.
              </p>

              <p className="mt-4">
                Jos useampi asiakas valitsee
                saman palveluntarjoajan
                samalle päivälle, varaus
                vahvistetaan sille
                asiakkaalle, jonka lopullinen
                vahvistus hyväksytään ensin.
                Muiden asiakkaiden alustava
                valinta voidaan vapauttaa tai
                hylätä automaattisesti.
              </p>

              <p className="mt-4">
                OmatJuhlat pyrkii estämään
                päällekkäiset vahvistetut
                varaukset teknisesti, mutta
                palveluntarjoaja vastaa myös
                oman saatavuutensa
                ajantasaisuudesta.
              </p>
            </TermsSection>

            <TermsSection title="10. Palvelun maksullisuus">
              <p>
                Tarjouspyynnön lähettäminen,
                tarjousten vertailu ja
                palveluntarjoajan valinta
                ovat asiakkaalle tällä
                hetkellä maksuttomia.
              </p>

              <p className="mt-4">
                Mahdollisista
                palveluntarjoajille
                tarkoitetuista maksuista,
                komissioista tai
                maksullisista lisäpalveluista
                sovitaan erikseen ennen
                niiden käyttöönottoa. Maksuja
                ei peritä takautuvasti ilman
                erillistä sopimusta.
              </p>
            </TermsSection>

            <TermsSection title="11. Käyttäjien sisältö ja oikeudet">
              <p>
                Käyttäjä säilyttää
                omistusoikeuden palveluun
                lisäämäänsä sisältöön.
                Käyttäjä antaa
                OmatJuhlat-palvelulle
                käyttöoikeuden näyttää,
                käsitellä ja välittää sisältöä
                siinä laajuudessa kuin
                palvelun toteuttaminen
                edellyttää.
              </p>

              <p className="mt-4">
                Julkiseen yritysprofiiliin
                lisättyjä kuvia, logoja,
                palvelukuvauksia ja muita
                tietoja voidaan näyttää
                OmatJuhlat-verkkosivustolla
                yrityksen markkinoimiseksi.
              </p>

              <p className="mt-4">
                Käyttäjä vastaa siitä, ettei
                hänen lisäämänsä sisältö
                loukkaa tekijänoikeuksia,
                tavaramerkkejä,
                yksityisyyttä tai muita
                kolmannen osapuolen
                oikeuksia.
              </p>
            </TermsSection>

            <TermsSection title="12. Kielletty käyttö">
              <p>
                Palvelua ei saa käyttää:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  lainvastaiseen,
                  vilpilliseen tai
                  harhaanjohtavaan toimintaan
                </li>
                <li>
                  tekaistujen
                  tarjouspyyntöjen,
                  tarjousten tai arvostelujen
                  lähettämiseen
                </li>
                <li>
                  toisen henkilön tai
                  yrityksen esiintymiseen
                  ilman oikeutta
                </li>
                <li>
                  roskapostin,
                  haittaohjelmien tai
                  häiritsevän sisällön
                  levittämiseen
                </li>
                <li>
                  palvelun turvallisuuden,
                  käyttöoikeuksien tai
                  teknisten rajoitusten
                  kiertämiseen
                </li>
                <li>
                  palvelun automatisoituun
                  kuormittamiseen tai
                  tietojen keräämiseen ilman
                  lupaa
                </li>
              </ul>
            </TermsSection>

            <TermsSection title="13. Käyttöoikeuden rajoittaminen">
              <p>
                OmatJuhlat voi rajoittaa tai
                estää palvelun käytön, poistaa
                sisältöä tai sulkea
                partneritilin, jos käyttäjä:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  rikkoo näitä käyttöehtoja
                  tai lakia
                </li>
                <li>
                  antaa olennaisesti vääriä
                  tietoja
                </li>
                <li>
                  vaarantaa asiakkaiden,
                  palveluntarjoajien tai
                  palvelun turvallisuuden
                </li>
                <li>
                  käyttää palvelua
                  vilpillisesti tai
                  häiritsevästi
                </li>
              </ul>

              <p className="mt-4">
                Käyttäjälle pyritään
                ilmoittamaan rajoituksesta ja
                sen syystä, ellei ilmoittaminen
                vaaranna tietoturvaa,
                selvitystä tai muiden
                oikeuksia.
              </p>
            </TermsSection>

            <TermsSection title="14. Palvelun toimivuus ja muutokset">
              <p>
                OmatJuhlat pyrkii pitämään
                palvelun turvallisena ja
                käytettävissä, mutta ei takaa
                keskeytyksetöntä tai täysin
                virheetöntä toimintaa.
              </p>

              <p className="mt-4">
                Palvelussa voi esiintyä
                huoltoja, teknisiä häiriöitä,
                tietoliikenneongelmia tai
                kolmansien osapuolten
                palveluista johtuvia
                käyttökatkoja.
              </p>

              <p className="mt-4">
                Palvelun ominaisuuksia voidaan
                kehittää, muuttaa tai poistaa,
                jos se on tarpeen palvelun
                turvallisuuden, toimivuuden
                tai liiketoiminnan
                kehittämiseksi.
              </p>
            </TermsSection>

            <TermsSection title="15. Vastuunrajoitukset">
              <p>
                Palveluntarjoaja vastaa
                asiakkaalle oman tarjouksensa
                oikeellisuudesta,
                saatavuudestaan, palvelunsa
                laadusta, turvallisuudesta,
                sopimuksen täyttämisestä ja
                soveltuvien lakien
                noudattamisesta.
              </p>

              <p className="mt-4">
                OmatJuhlat ei vastaa
                palveluntarjoajan toiminnasta,
                palvelun virheestä,
                viivästymisestä,
                peruuntumisesta,
                vahingosta tai osapuolten
                välisestä maksu- tai
                sopimusriidasta, ellei vastuu
                perustu OmatJuhlat-palvelun
                omaan lainvastaiseen tai
                tuottamukselliseen toimintaan.
              </p>

              <p className="mt-4">
                OmatJuhlat ei vastaa
                käyttäjän antamista
                virheellisistä tiedoista,
                henkilökohtaisen linkin
                huolimattomasta jakamisesta
                tai käyttäjän oman tilin
                suojaamisen laiminlyönnistä.
              </p>

              <p className="mt-4">
                Näillä ehdoilla ei rajoiteta
                vastuuta siltä osin kuin
                vastuun rajoittaminen olisi
                pakottavan lain vastaista.
              </p>
            </TermsSection>

            <TermsSection title="16. Ylivoimainen este">
              <p>
                Osapuoli ei vastaa
                viivästyksestä tai
                velvoitteen täyttämättä
                jäämisestä siltä osin kuin se
                johtuu kohtuudella
                vaikutusmahdollisuuksien
                ulkopuolella olevasta
                ylivoimaisesta esteestä,
                kuten laajasta
                tietoliikennehäiriöstä,
                viranomaismääräyksestä,
                luonnonkatastrofista,
                työtaistelusta tai
                palveluntarjoajan
                infrastruktuurin vakavasta
                häiriöstä.
              </p>
            </TermsSection>

            <TermsSection title="17. Henkilötietojen käsittely">
              <p>
                Henkilötietojen käsittelystä
                kerrotaan tarkemmin
                OmatJuhlat-palvelun
                tietosuojaselosteessa.
              </p>

              <Link
                href="/tietosuoja"
                className="mt-3 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                Lue tietosuojaseloste →
              </Link>
            </TermsSection>

            <TermsSection title="18. Palaute, reklamaatiot ja riidat">
              <p>
                Palvelun teknistä toimintaa
                tai OmatJuhlat-palvelua
                koskevat yhteydenotot voi
                lähettää osoitteeseen:
              </p>

              <a
                href="mailto:info@omatjuhlat.fi"
                className="mt-3 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                info@omatjuhlat.fi
              </a>

              <p className="mt-4">
                Juhlapalvelun sisältöä,
                hintaa, maksua,
                peruuttamista tai toteutusta
                koskeva reklamaatio tulee
                ensisijaisesti osoittaa
                kyseiselle
                palveluntarjoajalle.
              </p>

              <p className="mt-4">
                Kuluttaja voi saada
                kuluttajaoikeudellista
                neuvontaa Kilpailu- ja
                kuluttajaviraston
                kuluttajaneuvonnasta.
              </p>

              <a
                href="https://www.kkv.fi/kuluttaja-asiat/kuluttajaneuvonta/"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                Kuluttajaneuvonta →
              </a>
            </TermsSection>

            <TermsSection title="19. Sovellettava laki">
              <p>
                Näihin ehtoihin sovelletaan
                Suomen lakia. Kuluttajan
                pakottavaan lainsäädäntöön
                perustuvat oikeudet säilyvät
                näistä ehdoista riippumatta.
              </p>

              <p className="mt-4">
                Erimielisyydet pyritään
                ratkaisemaan ensisijaisesti
                osapuolten välisillä
                neuvotteluilla.
              </p>
            </TermsSection>

            <TermsSection title="20. Ehtojen muuttaminen">
              <p>
                OmatJuhlat voi päivittää
                näitä ehtoja palvelun,
                lainsäädännön tai
                toimintamallin muuttuessa.
                Ajantasaiset ehdot julkaistaan
                tällä sivulla.
              </p>

              <p className="mt-4">
                Olennaisista muutoksista
                pyritään ilmoittamaan
                rekisteröityneille
                palveluntarjoajille tai muille
                käyttäjille, joita muutos
                suoraan koskee.
              </p>
            </TermsSection>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function TermsSection({
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