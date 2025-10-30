import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/_layout/about')({
  component: RouteComponent,
})

const featuresData = [
  {
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" className="text-purple-500 size-8 mt-4"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>),
    title: "Vision",
    description: "A transparent, mobile-first lotto experience that supports responsible play and delivers real value to players across Nigeria.",
  },
  {
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" className="text-purple-500 size-8 mt-4"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /></svg>),
    title: "Mission",
    description: "Use secure technology, simple design, and instant wallet crediting to make lotto easy to understand, quick to play, and fair to win.",
  }
];

function RouteComponent() {
  return (
    <>
      <section
        className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">About Us</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4">
            <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
              <Image width={500} height={500} className="max-w-md w-full object-cover rounded-2xl"
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"
                alt="" />
            </div>
            <div className="text-sm text-slate-600 max-w-lg">
              <h1 className="text-xl uppercase font-semibold text-slate-700">  MaxiLotto, by LukzerNet Nigeria Limited</h1>
              <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-primary-900 to-secondary-900"></div>
              <p className="mt-8">
                MaxiLotto is a modern 5/90 lotto platform created for today’s players—fast, transparent, and easy to use. As a brand of LukzerNet Nigeria Limited, we combine secure technology with clear rules and quick payouts, so you can focus on the thrill of the draw.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-col items-start justify-center gap-5 max-md:px-4">
            <div className="space">
              <h3 className="text-lg uppercase font-semibold text-slate-700">Our Vision & Mission</h3>
            </div>

            <div className="text-sm text-slate-600 max-w-lg">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 mt-5 sm:px-6 px-0">
                {featuresData.map((feature, index) => (
                  <div
                    key={index}
                    className={`hover:-translate-y-0.5 w-full transition duration-300 ${index === 1
                      ? 'p-px rounded-[13px] text-background bg-[linear-gradient(72deg,#0185b6,#00d49c)]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <div className="p-6 rounded-xl space-y-4 border border-border shadow w-full h-full">
                      <h3 className="text-xl font-montserrat font-medium">{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
