---
title: "How Your Car Gossips: V2V, Explained Over Chai"
chapter: "2"
date: "2026-08-10"
author: "Code Ninja"
description: "No internet. No satellites. Just vehicles whispering to each other ten times a second — here’s how V2V actually works."
readingTime: "10 min read"
series: "Kavach — India’s V2V Revolution"
---

# Chapter 2 – How Your Car Gossips: V2V, Explained Over Chai

**By a college student who fell down a rabbit hole**

<!-- refer b6.png image, 16:9 -->

My roommate thinks I’ve lost it.

Fair. Last week I spent four hours reading a government technical document *voluntarily*, and when he asked what I was doing, I said: “Bhai, cars are going to gossip with each other and it’s going to save tens of thousands of lives a year.”

He went back to his reels. His loss.

Because once you actually understand how V2V works, it’s one of the cleanest ideas I’ve seen. No satellites. No internet. Just vehicles, whispering to each other ten times a second, forever.

So grab a chai. I’ll explain it the way I wish someone had explained it to me.

---

## The Group Chat Analogy

Think about your class WhatsApp group. Everyone’s in it, everyone can post, everyone sees everything. Messages just show up.

**V2V is that, but for vehicles — and the only thing anyone ever posts is “here’s exactly what I’m doing right now.”**

Every equipped vehicle constantly sends out a tiny wireless packet called a **Basic Safety Message (BSM)**. It’s small — a few hundred bytes — and it’s broadcast up to **ten times per second**. Every other V2V‑equipped vehicle within roughly 300 metres hears it and does the same.

No mobile tower in the loop. No cloud server. Just radios talking directly to other radios in a moving, self‑organising network of vehicles.

Your car is basically in a group chat with every other connected vehicle around it. It doesn’t send memes, just “here’s what I’m doing” — over and over and over.

---

## What Your Car Actually Says

Your car isn’t sharing gossip; it’s sharing physics.

A typical BSM includes four key pieces of data:

- **Position:** GPS coordinates — “I am here,” accurate to within a few metres.
- **Speed:** How fast you’re moving right now.
- **Heading:** Which direction you’re pointed and travelling.
- **Movement state:** Whether you’re braking, accelerating, turning, or have hazard lights on.

Standards like SAE J2735 add extra fields — for example, vehicle size and a temporary ID certificate — so receivers know roughly how big you are and that the message is genuine, without exposing your permanent identity.

All of that is broadcast roughly every 100 milliseconds. At the same time, your car is **listening** to every other BSM it hears and running one simple but constant calculation:

> “Given where I am and where I’m going — and where that vehicle is and where it’s going — are we about to have a problem?”

It does that ten times a second for every vehicle nearby.

Your car becomes that one overcautious friend who grabs your shirt before you walk into traffic — except it never gets tired, never gets distracted, and never lies.

---

## The Cheat Code: Seeing Through Walls

Here’s the part that made me stop treating this like a boring standard and start treating it like a cheat code.

Every safety thing your car currently has — cameras, radar, parking sensors — has the same limitation: **they need line of sight.** Cameras can’t see through buses. Radar struggles around buildings. Your eyes definitely can’t.

Radio messages don’t care as much. They can slip around objects, through gaps, and bounce in ways light and radar can’t. V2V uses radio in the 5.9 GHz band to let vehicles “see” each other even when they’re physically hidden.

The US safety agency NHTSA literally uses the example of a vehicle braking hard several cars ahead in traffic: on‑board sensors can’t see it, but V2V messages broadcast that “hard braking” event to following vehicles within about 300 metres. So:

- A truck slams its brakes three cars ahead, hidden behind a bus. Your car hears the BSM with “hard braking” and knows **before** you ever see brake lights.
- Two cars approach a blind intersection with a building blocking the view. Their V2V radios have already been exchanging position, speed and heading for hundreds of metres; both cars can calculate the collision path *before* the drivers see anything.

The whole point: V2V lets your car know about danger that its own sensors — and your eyes — *physically cannot see*.

On Indian roads, where “I couldn’t see him” is basically a daily sentence, that extra invisible sense matters.

---

## No Internet Required

You might wonder: “Is this using my mobile data? Will my safety depend on network bars?”

Fortunately, no.

V2V uses **dedicated short‑range radio communication** — either DSRC or the newer C‑V2X sidelink — in a special slice of spectrum reserved just for intelligent transport systems.

In the original US design, V2V operates in a 75 MHz band of the **5.9 GHz spectrum**, with vehicles exchanging Basic Safety Messages up to ten times per second at ranges of around 300 metres. In India, MoRTH’s draft refers to using the **5.875–5.925 GHz band** for V2V systems under the AIS‑230 standard.

Why that matters:

- **Latency:** Safety messages need to travel in tens of milliseconds, not seconds. Routing them through cell towers and remote servers adds delays that make them useless for crash prevention.
- **Coverage:** Our highway network includes tunnels, rural stretches and “no signal” zones. Radios talking directly to radios keep working as long as vehicles are within range, even with no mobile coverage.
- **Cost:** Nobody is paying per packet. The safety spectrum is treated as public infrastructure rather than a billable telecom service.

So on that stretch where your phone sulks on one bar of EDGE, your car can still hear “I’m braking hard” broadcasts from other vehicles.

---

## India’s Tech Choice: Skipping the Line

Globally, the tech family tree looks roughly like this:

- **DSRC (IEEE 802.11p):** Wi‑Fi‑based, older tech; many early V2V pilots used this in the 5.9 GHz band.
- **C‑V2X:** Newer standard defined by 3GPP; supports both direct vehicle‑to‑vehicle links and connections via LTE/5G networks.

India has indicated it wants to use **C‑V2X in the 5.875–5.925 GHz band**, aligning with global moves toward newer, more robust radios while still keeping the direct vehicle‑to‑vehicle link.

That’s basically the “skip landlines, go straight to mobile phones” move we did years ago — but for cars.

And then India adds its own twist: instead of just mandating V2V for cars and trucks, the draft extends it down to **Category L vehicles — two‑wheelers and three‑wheelers**. Globally, most V2V discussions centre on cars. India looked at our roads — 24 crore scooters and bikes sharing lanes with buses and trucks — and said, “The Activa gets a voice too.”

For once, we’re designing a safety system around how *our* roads actually look.

---

## When Your Car Decides You’re in Trouble

So your car has heard a bunch of BSMs, done the math, and concluded you’re on a collision path. What does it actually *do*?

Right now, in most implementations, V2V is a **warning layer**. It doesn’t independently steer or slam the brakes. It fires alerts:

- A sound — a distinct chime or tone.
- A visual — an icon or message on the instrument cluster or HUD.
- Sometimes a haptic nudge — vibration in the seat or steering wheel.

Message sets and standards like SAE J2735 and AIS‑230 tie alerts to specific scenarios: forward‑collision risk, blind‑intersection collision, emergency vehicle approaching, wrong‑way driver detected.

The whole point is to give you **extra seconds**. At 80 km/h on a highway, an extra half‑second of warning can translate into several additional metres of braking distance — sometimes the difference between “near miss” and “newspaper headline.”

Future generations will likely feed more aggressively into Automatic Emergency Braking and other driver‑assist features. For India’s 2028 rollout, the focus is on waking the driver up before physics takes over.

---

## The Real‑World Limits

As cool as this sounds, it’s not a magic shield.

- **Only connected vehicles talk.** In 2028–2029, your V2V‑equipped car will share the road with millions of older vehicles that have no radios at all. Cameras, radar and human judgement are still essential.
- **V2V doesn’t automatically see pedestrians or cows.** There are related ideas — V2P (Vehicle‑to‑Pedestrian), V2I (Vehicle‑to‑Infrastructure), broader V2X — where phones, wearables and roadside units join the conversation, but those are separate systems.
- **Drivers can ignore alerts.** A system that screams too often or too vaguely will train people to tune it out. Calibration and good user experience are as important as spectrum allocations.

None of that kills the idea. It just means V2V is another layer in India’s safety stack, not a silver bullet.

---

## One Line You Can Drop in Your Group Chat

If you want a TL;DR to drop in your friends’ chat and sound smart:

> **V2V basically turns every vehicle into a radio that shouts “here’s what I’m doing” ten times a second, so other vehicles can warn their drivers about crashes *before* anyone can see the danger — and it works even with no internet.**

That’s the tech hiding under the hood of India’s 2028 mandate.

In Chapter 3, I stop explaining hardware and start telling stories: seven very specific moments where this system quietly saves your life — the sudden brake, the blind curve, the wrong‑way maniac, the ambulance — each as a “here’s what actually happens” scene.

Numbers are one thing. Imagining the exact moment when your car taps you on the shoulder before everything goes wrong? That’s where it gets real.

---

## Sources

1. [NHTSA — Improving Safety and Mobility Through Vehicle-to-Vehicle Communication Technology](https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/v2v_fact_sheet_101414_v2a.pdf)
2. [NHTSA — Development of a Verified Message Parser for V2V Communications](https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/13264-verificationv2vreport_030718_v4a_tag.pdf)
3. [SAE International — J2735 V2X Communications Message Set Dictionary](https://saemobilus.sae.org/standards/j2735_202409-v2x-communications-message-set-dictionary)
4. [3GPP — Vehicle-to-Vehicle Services Based on LTE Sidelink](https://www.3gpp.org/news-events/partner-news/v2x-tests)
5. [Department of Telecommunications, Government of India — National Frequency Allocation Plan](https://dot.gov.in/sites/default/files/NFAP%202018.pdf?download=1)
6. [Department of Telecommunications, Government of India — C-V2X 5.9 GHz Rules](https://www.dot.gov.in/whats-new)
