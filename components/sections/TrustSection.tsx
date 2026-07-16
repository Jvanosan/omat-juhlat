import Card from "@/components/ui/Card";

const ITEMS = [
  {
    icon: "🔒",
    title: "Turvallinen palvelu",
    description:
      "Tietosi välitetään vain valitsemillesi palveluntarjoajille.",
  },
  {
    icon: "💚",
    title: "Maksuton",
    description:
      "Tarjouspyynnön lähettäminen on täysin ilmaista.",
  },
  {
    icon: "⭐",
    title: "Ei sitoumuksia",
    description:
      "Saat vertailla tarjoukset rauhassa ja päätät itse hyväksytkö ne.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#faf8f5] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <Card key={item.title} className="text-center">
              <div className="text-4xl">{item.icon}</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}