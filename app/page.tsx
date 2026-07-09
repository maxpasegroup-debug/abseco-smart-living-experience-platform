"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88";

const collections = [
  {
    title: "Smart Lighting",
    text: "Ambience for every moment",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Switches",
    text: "Elegant control at your fingertips",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Curtains",
    text: "Automated shades and blinds",
    image: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Security",
    text: "Advanced safety and access",
    image: "https://images.unsplash.com/photo-1558002038-bb0237f0e7f3?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Climate",
    text: "Perfect comfort, always",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Home Theatre",
    text: "Immersive audio and video",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Gates",
    text: "Secure arrivals without friction",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Video Door Phone",
    text: "See, speak, and unlock",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Smart Kitchen",
    text: "Appliances that work with you",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82"
  },
  {
    title: "Luxury Bathrooms",
    text: "Lighting, mirrors, music, comfort",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=82"
  }
];

const features = [
  ["One Touch Scenes", "Control everything instantly"],
  ["Voice Control", "Your home, your command"],
  ["AI Automation", "Learns your lifestyle"],
  ["Energy Optimization", "Smarter today, greener tomorrow"],
  ["24/7 Security", "Always protected"],
  ["Remote Access", "Your home from anywhere"],
  ["Scheduling", "The right moment, every time"],
  ["Smart Climate", "Comfort without effort"]
];

const why = [
  "Luxury Experience",
  "AI Powered Automation",
  "Energy Savings",
  "Premium Installation",
  "Lifetime Support",
  "Future Ready Technology"
];

const process = ["Discover", "Design", "Experience", "Consultation", "Proposal", "Installation", "Enjoy"];

const overlays = [
  { className: "left-[45%] top-[22%]", icon: "LT", title: "Lighting", room: "Living Room", value: "100%" },
  { className: "left-[28%] top-[36%]", icon: "CT", title: "Curtains", room: "Bedroom", value: "Closed" },
  { className: "left-[28%] top-[58%]", icon: "AC", title: "AC", room: "24C", value: "Cooling" },
  { className: "right-[2%] top-[48%]", icon: "LK", title: "Security", room: "Front Door", value: "Locked" },
  { className: "right-[2%] bottom-[18%]", icon: "MU", title: "Music", room: "Living Room", value: "Playing" },
  { className: "left-[58%] bottom-[20%]", icon: "SC", title: "Cinema Mode", room: "Home Theatre", value: "Activated" }
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
  } as const;
}

export default function HomePage() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#02050d] text-white">
      <section className="relative min-h-[720px] overflow-hidden border-b border-white/[0.06] lg:min-h-[660px]">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#02050d_0%,rgba(2,5,13,0.94)_24%,rgba(2,5,13,0.56)_48%,rgba(2,5,13,0.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,13,0)_45%,#02050d_100%)]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_16%,rgba(255,122,24,0.18),transparent_32%),linear-gradient(180deg,rgba(2,5,13,0.2),rgba(2,5,13,0.96))]" />

        <div className="relative z-10 mx-auto grid min-h-[720px] w-full max-w-[1500px] items-center gap-8 px-5 pb-14 pt-12 lg:min-h-[660px] lg:grid-cols-[0.43fr_0.57fr] lg:px-10">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }} className="max-w-[610px]">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#ff7a18]/35 bg-[#ff6a00]/8 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_34px_rgba(255,106,0,0.16)]">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-[#ff7a18]/40 text-[#ff7a18]">AI</span>
              AI Powered Home <span className="text-[#ff7a18]">Automation</span>
            </div>

            <h1 className="mt-8 font-display text-[3.25rem] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-[4.8rem] lg:text-[5.25rem]">
              Intelligent Homes.
              <span className="block text-[#ff6a00]">Effortless</span>
              <span className="block">Living.</span>
            </h1>

            <p className="mt-7 max-w-[520px] text-lg leading-8 text-slate-300">
              AI powered luxury home automation designed for comfort, safety, energy saving, voice control and effortless everyday living.
            </p>

            <div className="mt-9 grid max-w-[560px] gap-5 text-sm sm:grid-cols-3">
              {[
                ["AI Automation", "Learns your lifestyle"],
                ["Total Control", "Anytime, anywhere"],
                ["Secure & Reliable", "Built for peace of mind"]
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3 border-white/10 sm:border-r sm:last:border-r-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ff7a18]/40 text-xs font-bold text-[#ff7a18]">+</span>
                  <span>
                    <span className="block font-bold text-white">{title}</span>
                    <span className="mt-1 block text-xs text-slate-400">{text}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/build" className="rounded-xl bg-gradient-to-br from-[#ff8f24] to-[#ff5700] px-7 py-5 text-center text-sm font-black text-white shadow-[0_16px_46px_rgba(255,106,0,0.48)] transition-transform hover:scale-[1.02]">
                Design My Dream Smart Home <span className="ml-5">-&gt;</span>
              </Link>
              <Link href="/experience" className="rounded-xl border border-white/18 bg-white/[0.03] px-7 py-5 text-center text-sm font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/[0.07]">
                Experience Smart Living <span className="ml-4 rounded-full border border-white/40 px-2 py-1 text-xs">PLAY</span>
              </Link>
            </div>

            <div className="mt-9">
              <p className="text-sm text-slate-400">Trusted technologies compatible with intelligent living.</p>
              <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-lg font-black tracking-[-0.03em] text-white/36">
                {["KNX", "Control4", "Lutron", "Zigbee", "Matter", "Alexa", "Google Home", "Apple Home"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative hidden min-h-[610px] lg:block">
            {overlays.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className={`absolute z-20 w-[142px] rounded-xl border border-white/16 bg-black/38 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl ${item.className}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/16 text-[10px] font-black text-white">{item.icon}</span>
                  <span>
                    <span className="block text-sm font-black text-white">{item.title}</span>
                    <span className="block text-xs text-slate-200">{item.room}</span>
                    <span className="block text-xs font-bold text-white">{item.value}</span>
                  </span>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.25 }}
              className="absolute bottom-0 right-[14%] z-30 h-[455px] w-[235px] rounded-[2.1rem] border border-white/18 bg-[#050912] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.72),0_0_0_8px_rgba(255,255,255,0.04)]"
            >
              <div className="h-full overflow-hidden rounded-[1.55rem] border border-white/8 bg-[#050914] p-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-white">
                  <span>9:41</span><span>LTE</span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-black">My Home <span className="text-[#ff7a18]">v</span></h3>
                  <p className="mt-1 text-xs text-slate-400">Good Evening, Arjun</p>
                </div>
                <p className="mt-7 text-xs text-slate-500">Scenes</p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-[10px]">
                  {["Home", "Away", "Movie", "Sleep"].map((scene, index) => (
                    <span key={scene} className={`rounded-lg border px-2 py-2 text-center ${index === 0 ? "border-[#ff7a18] bg-[#ff6a00]/12 text-[#ff7a18]" : "border-white/10 bg-white/[0.03] text-slate-300"}`}>{scene}</span>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate-500">Devices</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["Lights", "6 On"],
                    ["Fans", "3 On"],
                    ["AC", "24C"],
                    ["Curtains", "Closed"],
                    ["Security", "Armed"],
                    ["Music", "Playing"],
                    ["Cameras", "Live"],
                    ["Voice", "Listening"]
                  ].map(([name, state]) => (
                    <div key={name} className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
                      <span className="block text-[11px] font-bold text-white">{name}</span>
                      <span className="mt-1 block text-[10px] text-slate-400">{state}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 border-t border-white/8 pt-4 text-center text-[9px] text-slate-500">
                  {["Home", "Rooms", "Scenes", "Settings"].map((item, index) => (
                    <span key={item} className={index === 0 ? "text-[#ff7a18]" : ""}>{item}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-7 w-[calc(100%-2rem)] max-w-[1420px] rounded-xl border border-white/[0.06] bg-[#111722]/72 px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {features.map(([title, text]) => (
            <div key={title} className="flex gap-3 border-white/10 xl:border-r xl:last:border-r-0">
              <span className="text-lg font-black text-[#ff6a00]">+</span>
              <span>
                <span className="block text-sm font-black text-white">{title}</span>
                <span className="mt-1 block text-xs text-slate-400">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1420px] space-y-24 px-5 pb-20 pt-10 lg:px-10">
        <motion.section {...fadeUp()} className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">Explore Smart Living Collections</h2>
              <div className="mt-3 h-0.5 w-8 bg-[#ff6a00]" />
            </div>
            <div className="hidden gap-3 sm:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70">&lt;</span>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white">-&gt;</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {collections.map((item) => (
              <article key={item.title} className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,13,0.05)_0%,rgba(2,5,13,0.15)_35%,rgba(2,5,13,0.86)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-200">{item.text}</p>
                  <Link href="/explore" className="mt-5 block text-sm font-bold text-[#ff6a00]">Explore -&gt;</Link>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <PremiumSection
          eyebrow="Why Choose ABSECO"
          title="Luxury automation, engineered end to end."
          body="Every ABSECO project combines intelligent design, premium hardware planning, clean installation and long-term care."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {why.map((item) => (
              <div key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6a00]">ABSECO</span>
                <h3 className="mt-4 text-lg font-black text-white">{item}</h3>
              </div>
            ))}
          </div>
        </PremiumSection>

        <SplitSection
          eyebrow="Experience Your Home"
          title="Upload a room. Visualize the intelligence."
          body="See smart lighting, motorized curtains, switch panels and scene moods before you book the consultation."
          cta="Experience My Home"
          href="/experience"
          image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1500&q=84"
        />

        <SplitSection
          reverse
          eyebrow="Design Your Dream Smart Home"
          title="A guided planner that turns lifestyle into a smart home plan."
          body="Answer simple questions about rooms, family, budget and goals. ABSECO recommends scenes, packages and upgrades."
          cta="Generate Smart Home Plan"
          href="/build"
          image="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1500&q=84"
        />

        <PremiumSection eyebrow="Real Projects" title="Designed for villas, apartments and cinematic rooms." body="A premium execution flow for lighting projects, home theatres, apartments, villas and before-after transformations.">
          <div className="grid gap-4 lg:grid-cols-5">
            {["Luxury Villas", "Apartments", "Home Theatres", "Lighting Projects", "Before & After"].map((item, index) => (
              <div key={item} className="rounded-xl border border-white/[0.08] bg-[#0d141e] p-5">
                <span className="text-3xl font-black text-[#ff6a00]">0{index + 1}</span>
                <h3 className="mt-8 text-lg font-black text-white">{item}</h3>
                <p className="mt-2 text-sm text-slate-400">Precision planning, silent control and warm cinematic lighting.</p>
              </div>
            ))}
          </div>
        </PremiumSection>

        <PremiumSection eyebrow="How It Works" title="From first idea to effortless living." body="The journey stays guided, premium and measurable from discovery to installation.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {process.map((item, index) => (
              <div key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5">
                <span className="text-sm font-black text-[#ff6a00]">{index + 1}</span>
                <h3 className="mt-6 text-base font-black text-white">{item}</h3>
              </div>
            ))}
          </div>
        </PremiumSection>

        <PremiumSection eyebrow="AI Smart Living Assistant" title="A private guide for choices, budget and visualization." body="The assistant helps customers choose the right automation goals, plan budgets, compare scenes and visualize their dream home with less guesswork.">
          <div className="rounded-2xl border border-[#ff6a00]/22 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),rgba(255,255,255,0.035))] p-8 shadow-[0_24px_90px_rgba(255,106,0,0.08)]">
            <div className="grid gap-5 md:grid-cols-4">
              {["Choose", "Plan", "Budget", "Visualize"].map((item) => (
                <div key={item} className="rounded-xl border border-white/[0.08] bg-black/25 p-5">
                  <h3 className="font-black text-white">{item}</h3>
                  <p className="mt-2 text-sm text-slate-400">Guided by your rooms, lifestyle and priorities.</p>
                </div>
              ))}
            </div>
          </div>
        </PremiumSection>

        <PremiumSection eyebrow="Testimonials" title="Customer stories, ratings and video reviews." body="A premium experience is measured after handover. ABSECO keeps the journey transparent from plan to living room.">
          <div className="grid gap-4 md:grid-cols-3">
            {["Villa owner", "Apartment family", "Home theatre client"].map((item) => (
              <blockquote key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6">
                <p className="text-sm leading-7 text-slate-300">The design, installation and controls felt premium from day one. Every scene works exactly the way our family lives.</p>
                <footer className="mt-6 text-sm font-black text-white">{item}</footer>
                <p className="mt-1 text-xs text-[#ff6a00]">5.0 rating | Video review placeholder</p>
              </blockquote>
            ))}
          </div>
        </PremiumSection>

        <section className="overflow-hidden rounded-2xl border border-[#ff6a00]/22 bg-[#10151f] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.36)] md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6a00]">Book Your Consultation</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">Ready to design your intelligent home?</h2>
              <p className="mt-5 max-w-2xl text-slate-400">Design your home, book a site visit, or talk to an ABSECO expert today.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/build" className="rounded-xl bg-[#ff6a00] px-7 py-4 text-center text-sm font-black text-white shadow-[0_18px_44px_rgba(255,106,0,0.35)]">Design My Home</Link>
              <Link href="/consultation?type=site_visit" className="rounded-xl border border-white/18 px-7 py-4 text-center text-sm font-bold text-white">Book Site Visit</Link>
              <Link href="/consultation" className="rounded-xl border border-white/18 px-7 py-4 text-center text-sm font-bold text-white">Talk to an Expert</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#030711] px-5 py-12 lg:px-10">
        <div className="mx-auto grid max-w-[1420px] gap-8 md:grid-cols-[1.3fr_2fr]">
          <div>
            <h2 className="font-display text-3xl font-black tracking-[-0.04em] text-white">ABSECO</h2>
            <p className="mt-1 text-sm font-bold uppercase tracking-[0.28em] text-[#ff6a00]">Smart Living</p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">AI Powered Luxury Home Automation for intelligent homes, effortless living and premium project execution.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-5">
            {["Products", "Solutions", "Projects", "Support", "Contact"].map((item) => (
              <div key={item}>
                <h3 className="text-sm font-black text-white">{item}</h3>
                <div className="mt-4 grid gap-2 text-sm text-slate-500">
                  <Link href="/explore">Explore</Link>
                  <Link href="/consultation">Consultation</Link>
                  <Link href="/profile">Account</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1420px] flex-wrap justify-between gap-4 border-t border-white/[0.08] pt-6 text-xs text-slate-500">
          <span>Copyright 2026 ABSECO Smart Living. All rights reserved.</span>
          <span>Instagram | LinkedIn | YouTube | Facebook</span>
        </div>
      </footer>
    </div>
  );
}

function PremiumSection({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <motion.section {...fadeUp()} className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6a00]">{eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
        <p className="mt-5 text-base leading-8 text-slate-400">{body}</p>
      </div>
      {children}
    </motion.section>
  );
}

function SplitSection({
  eyebrow,
  title,
  body,
  cta,
  href,
  image,
  reverse
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <motion.section {...fadeUp()} className={`grid items-center gap-8 lg:grid-cols-2 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
      <div className="space-y-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6a00]">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
        <p className="max-w-xl text-base leading-8 text-slate-400">{body}</p>
        <Link href={href} className="inline-block rounded-xl bg-[#ff6a00] px-6 py-4 text-sm font-black text-white shadow-[0_18px_44px_rgba(255,106,0,0.28)]">
          {cta}
        </Link>
      </div>
      <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,13,0.06),rgba(2,5,13,0.64))]" />
        <div className="absolute bottom-5 left-5 rounded-xl border border-white/12 bg-black/38 p-4 text-sm font-bold text-white backdrop-blur-xl">
          ABSECO Smart Living Preview
        </div>
      </div>
    </motion.section>
  );
}
