// ============================================================
// THE STEVE SHOW — Channel Content
// Powered by EVE Frontier World API + Claude AI
// ============================================================

const API_BASE = 'https://world-api-stillness.live.tech.evefrontier.com';

export interface Segment {
  label: string;
  text: string;
  source: string;
}

export interface Channel {
  id: number;
  name: string;
  segments: Segment[];
}

export const FALLBACK_TRIBES = [
  { name: "WiNGSPAN Deep Space Rescue", nameShort: "WDSR", description: "Are you out there on the Frontier, running low on ammo, Fuel, and time? Never fear, we'll send you home." },
  { name: "Black Flag Pirate Co.", nameShort: "BFPC", description: "A bond forged in the crucible of battle and shared conquests. Brotherhood bound by loyalty, trust, and the unbreakable spirit of true friendship." },
  { name: "HEGEMONY", nameShort: "HEGE", description: "hegemony :)" },
  { name: "House Atreides", nameShort: "ATR", description: "Creating Civilization from the ashes no matter the cost. Tailored for players of all types. Feel free to join us and explore the stars." },
  { name: "Nyx Syndicate", nameShort: "NS", description: "We are echoes, the last remnants of a world long gone. Power waits in the shadows. Trust is fragile." },
  { name: "CRAB Co", nameShort: "CRAB", description: "A pipedream of an interstellar mining venture amongst two brothers. Today CRAB Co is at the front of mining in the Universe." },
  { name: "Debitum Naturae", nameShort: "DMNA", description: "Oh snap, look who's back." },
  { name: "Slow Children at Play", nameShort: "SLOW", description: "SLOW is now here." },
  { name: "Algorithmic Warfare", nameShort: "AWAR", description: "We can be the hackers of this world and its structure. A gathering of independent players with different dreams that come to align. This is your call to fight for the vision." },
  { name: "VULTUR", nameShort: "VLTR", description: "We don't build empires. We take them apart. No borders. No fixed positions. We operate in Epochs. Our legacy will be the stories our enemies tell." },
  { name: "Interstellar Contract Agency", nameShort: "ICA", description: "Masters of assassination, covert operations, and mercenary contracts. Your performance dictates your status." },
  { name: "The Ancients", nameShort: "ANCT", description: "A casual group of older and mature players. We defend what's ours, and each other. 24 years of EVE Online experience." },
  { name: "Conflict Curators", nameShort: "Plz", description: "We act with honor and fairness towards friends and enemies alike. We believe in laying public infrastructure for all. We don't punch down." },
  { name: "Biohazard", nameShort: "BIO", description: "Formed in 2013 in EVE Online, where we commanded thousands of fleets. When Frontier called, we knew we had to dive back in." },
  { name: "ExoTech Industrial", nameShort: "EXTI", description: "We don't just play the Frontier. We build it. We are Awakened. We Endure." },
  { name: "Reapers", nameShort: "REAP", description: "A relentless force. A formidable PvP powerhouse backed by a precision-engineered industrial and logistical core." },
  { name: "Ronin", nameShort: "NIN", description: "Roaming Ronin." },
  { name: "Rooks and Kings", nameShort: "RnK", description: "A name that carries weight across two decades of space warfare." },
  { name: "SMERG", nameShort: "SMERG", description: "SMERG SMERG SMERG SMERG SMERG." },
  { name: "Yield Guild Games", nameShort: "YGG", description: "Stronger Together. Zero Toxicity. Full Support. Sub guilds include POTATO." },
];

export const FALLBACK_SYSTEMS = [
  "A 2560", "M 974", "U 3183", "03H-1FN", "I9T-0FN", "0FC-3FN",
  "UR7-5FN", "071-4FN", "U2L-4FN", "UT4-2FN", "E06-D68", "I9T-MV8",
  "E8P-V58", "IQ1-VS8", "E4R-HL8", "UGC-3C8", "AHR-HK7", "I8T-0L8"
];

export const FALLBACK_SHIPS = [
  { name: "Reiver", className: "Corvette" },
  { name: "Recurve", className: "Corvette" },
  { name: "Reflex", className: "Corvette" },
  { name: "USV", className: "Frigate" },
  { name: "MCF", className: "Frigate" },
  { name: "MAUL", className: "Cruiser" },
  { name: "Chumaq", className: "Combat Battlecruiser" },
];

export const FALLBACK_ITEMS = [
  "Crude Matter", "Sophrogon", "Feldspar Crystals", "Silicon Dust",
  "Nickel-Iron Veins", "Hull Repairer", "Crude Extractor", "Feral Data"
];

let liveTribes: typeof FALLBACK_TRIBES = [];
let liveSystems: string[] = [];
let liveShips: typeof FALLBACK_SHIPS = [];
let liveItems: string[] = [];

export async function loadLiveData(): Promise<void> {
  try {
    const [tribesRes, systemsRes, shipsRes, typesRes] = await Promise.allSettled([
      fetch(`${API_BASE}/v2/tribes`),
      fetch(`${API_BASE}/v2/solarsystems`),
      fetch(`${API_BASE}/v2/ships`),
      fetch(`${API_BASE}/v2/types`),
    ]);
    if (tribesRes.status === 'fulfilled' && tribesRes.value.ok) {
      const d = await tribesRes.value.json();
      const player = d.data.filter((t: any) => t.id >= 98000000 && t.description && t.description.length > 5);
      if (player.length > 0) liveTribes = player;
    }
    if (systemsRes.status === 'fulfilled' && systemsRes.value.ok) {
      const d = await systemsRes.value.json();
      if (d.data?.length > 0) liveSystems = d.data.map((s: any) => s.name);
    }
    if (shipsRes.status === 'fulfilled' && shipsRes.value.ok) {
      const d = await shipsRes.value.json();
      if (d.data?.length > 0) liveShips = d.data.map((s: any) => ({ name: s.name, className: s.className }));
    }
    if (typesRes.status === 'fulfilled' && typesRes.value.ok) {
      const d = await typesRes.value.json();
      if (d.data?.length > 0) liveItems = d.data.map((i: any) => i.name);
    }
  } catch (e) {
    console.warn('EVE Frontier API unreachable — using fallback data');
  }
}

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a)) + a;

function getTribes() { return liveTribes.length > 0 ? liveTribes : FALLBACK_TRIBES; }
function getSystems() { return liveSystems.length > 0 ? liveSystems : FALLBACK_SYSTEMS; }
function getShips() { return liveShips.length > 0 ? liveShips : FALLBACK_SHIPS; }
function getItems() { return liveItems.length > 0 ? liveItems : FALLBACK_ITEMS; }

function buildCtx() {
  const tribes = getTribes();
  const t1 = rand(tribes);
  let t2 = rand(tribes);
  while (t2.name === t1.name) t2 = rand(tribes);
  return {
    t1, t2,
    sys: rand(getSystems()),
    ship: rand(getShips()),
    item: rand(getItems()),
    days: randInt(3, 847),
    units: randInt(12, 9400),
  };
}

async function callClaude(prompt: string): Promise<string | null> {
  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('No API key');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 350,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json();
    return data.content[0].text;
  } catch (e) {
    console.warn('Claude API error:', e);
    return null;
  }
}

export async function generateHistorySegment(): Promise<Segment> {
  const c = buildCtx();
  const t1desc = c.t1.description ? `"${c.t1.description}"` : 'left no description';
  const t2desc = c.t2.description ? `"${c.t2.description}"` : 'left no description';

  const prompt = `You are Steve. You host The Steve Show — a late night broadcast from the edge of the EVE Frontier universe.

You tell stories about civilizations that rose and fell. Your voice is sparse, devastating, and darkly beautiful. Short sentences. Long silences implied between them. You find the epic in what these groups actually were. You never mock them. You never give advice. You just report what happened, with quiet respect for the audacity of trying.

These are real groups built by real players:
- ${c.t1.name} [${c.t1.nameShort}]: ${t1desc}
- ${c.t2.name} [${c.t2.nameShort}]: ${t2desc}
- System: ${c.sys}
- Ship: ${c.ship.name} (${c.ship.className})
- Resource: ${c.item}
- Duration: ${c.days} days
- Scale: ${c.units} units

Write one civilization story. 4-6 sentences. Find what is genuinely remarkable about these groups. End with something that lands. End with "We'll be right back." Never say "historians." Never mock. Never advise.`;

  const text = await callClaude(prompt);
  return {
    label: 'FRONTIER CHRONICLE',
    text: text || `In system ${c.sys}, ${c.t1.name} built something worth building. ${c.units} units of ${c.item}. ${c.days} days.\n\nIt's gone now.\n\nWe'll be right back.`,
    source: `${c.t1.nameShort} + ${c.t2.nameShort} | ${c.sys} | EVE FRONTIER API`,
  };
}

export async function generateBreakingSegment(playerGossip: string): Promise<Segment> {
  const c = buildCtx();
  const prompt = `You are Steve. You host The Steve Show — a late night broadcast from EVE Frontier.

A viewer has submitted breaking news. Dramatize their gossip as a tabloid news story. Deadpan. Dry. Treat it like the most significant event in the history of the Frontier. Find the genuine drama. Respect the people involved — the humor comes from the situation, never from mocking anyone.

EVE Frontier context:
- Nearby tribe: ${c.t1.name} [${c.t1.nameShort}]
- System: ${c.sys}

Viewer submission: "${playerGossip}"

3-4 sentences. End with: "Unconfirmed. As all the best stories are."`;

  const text = await callClaude(prompt);
  return {
    label: 'BREAKING NEWS',
    text: text || `BREAKING: ${playerGossip}\n\nSteve has no further comment.\n\nUnconfirmed. As all the best stories are.`,
    source: 'VIEWER TIP | UNVERIFIED',
  };
}

export async function generateOracleSegment(): Promise<Segment> {
  const c = buildCtx();
  const t1desc = c.t1.description ? `"${c.t1.description}"` : 'no record remains';

  const prompt = `You are The Oracle — an ancient intelligence that has observed every cycle of the EVE Frontier. You report what you observed. You never advise. You never instruct. You never say "consider" or "you should." You state facts. The facts are sometimes extraordinary. You deliver them with complete calm.

Take inspiration from real EVE Online history — solo players achieving the impossible, betrayals that changed wars, corporations built over years that collapsed overnight. That energy. Applied to EVE Frontier.

Real Frontier data:
- Subject: ${c.t1.name} [${c.t1.nameShort}]: ${t1desc}
- Location: ${c.sys}
- Vessel: ${c.ship.name} (${c.ship.className})
- Resource: ${c.item}
- Duration: ${c.days} days
- Quantity: ${c.units} units

Report what The Oracle observed. 4-5 sentences. Specific, consequential, slightly unbelievable. Find the dignity in these real groups. Never mock. Never advise. Just report.`;

  const text = await callClaude(prompt);
  return {
    label: 'THE ORACLE SPEAKS',
    text: text || `The Oracle has observed the following.\n\nIn system ${c.sys}, ${c.t1.name} operated for ${c.days} days without interruption. ${c.units} units of ${c.item} passed through their hands.\n\nOn day ${c.days + 1}, the system was empty.\n\nThe Oracle has no further record.`,
    source: `ORACLE ARCHIVE | ${c.sys} | EVE FRONTIER API`,
  };
}

export const channels: Channel[] = [
  {
    id: 1,
    name: 'HISTORY',
    segments: [
      {
        label: 'FRONTIER CHRONICLE',
        text: "In system A 2560, they had everything. Crude Matter deposits so rich the constellation glowed. Three factions. A functioning economy. Something dangerously close to civilization.\n\nThen someone offered to help.\n\nWe'll be right back.",
        source: 'FRONTIER ARCHIVES | EVE FRONTIER API',
      },
    ],
  },
  {
    id: 2,
    name: 'BREAKING NEWS',
    segments: [
      {
        label: 'BREAKING NEWS',
        text: "DEVELOPING: Something is happening somewhere in the Frontier. Steve is looking into it.\n\nUnconfirmed. As all the best stories are.",
        source: 'LIVE FEED | EVE FRONTIER',
      },
    ],
  },
  {
    id: 3,
    name: 'THE ORACLE',
    segments: [
      {
        label: 'THE ORACLE SPEAKS',
        text: "The Oracle has observed the following.\n\nA solo Corvette pilot entered system I9T-MV8 eleven days ago with nothing. Today, 847 units of Crude Matter sit in a storage unit that did not exist two weeks ago.\n\nThe pilot has not logged out.\n\nThe Oracle has no further comment.",
        source: 'ORACLE ARCHIVE | EVE FRONTIER API',
      },
    ],
  },
];
