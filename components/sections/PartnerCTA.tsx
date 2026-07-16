import Link from "next/link";
import Card from "@/components/ui/Card";

export default function PartnerCTA() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden bg-gradient-to-r from-[#fffaf2] to-[#fdf5e6]">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl">🤝</div>

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Tarjoatko juhlapalveluita?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600 leading-7">
              Liity OmatJuhlat-kumppaniksi ja vastaanota uusia
              tarjouspyyntöjä suoraan asiakkailta.
            </p>

            <Link
              href="/partner/apply"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#C8A96A] px-8 py-4 font-semibold text-white transition hover:bg-[#B89757]"
            >
              Hae kumppaniksi
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}