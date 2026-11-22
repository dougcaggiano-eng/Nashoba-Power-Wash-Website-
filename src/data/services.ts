/**
 * Every service on the site is just data in this file.
 * Source of truth: BUSINESS_PROFILE_md.md (sections 2 and 8).
 * Do not add prices, reviews, insurance or licensing claims here.
 */

/** Clickable parts of the 3D house. Each one opens exactly one process section. */
export type PartId = 'siding' | 'patio' | 'deck' | 'fence' | 'walkway' | 'driveway';

/** What the 3D scene shows while a step is on screen. */
export type StepEffect =
  | 'inspect' // camera frames the part, nothing sprays
  | 'rinse' // plain water spray
  | 'foam' // foam cannon / soap sprayer
  | 'dwell' // solution sits, grime starts to fade
  | 'clean' // pressure or surface cleaner pass
  | 'sand' // polymeric sand sweep (patio restoration)
  | 'done'; // fully clean, sparkle

export interface ProcessStep {
  title: string;
  body: string;
  effect: StepEffect;
}

export interface BeforeAfter {
  /** Paths in /public/images, produced by `npm run photos`. Leave undefined until the owner adds photos. */
  before?: string;
  after?: string;
  alt: string;
}

export interface Service {
  id: string;
  part: PartId;
  /** Label on the model and on the part buttons */
  partLabel: string;
  name: string;
  tagline: string;
  typicalTime: string;
  steps: ProcessStep[];
  /** Reassuring care details from the profile */
  care: string[];
  beforeAfter: BeforeAfter;
}

const walkThrough: ProcessStep = {
  title: 'Walk-through and game plan',
  body:
    "Before any water goes on, we walk the job together and agree on exactly what's getting cleaned. That way you get what you asked for, and the quote matches the work. I also check for anything that pressure could make worse.",
  effect: 'inspect',
};

export const services: Service[] = [
  {
    id: 'house-wash',
    part: 'siding',
    partLabel: 'Vinyl siding',
    name: 'House Wash',
    tagline: 'Green streaks and grime off your vinyl siding, without blasting it.',
    typicalTime: 'About 3–4 hours, depending on the size of the house',
    steps: [
      walkThrough,
      {
        title: 'Pre-rinse the house, windows and plants',
        body:
          'Everything gets wet with plain water first. Bleach on dry siding can react with the surface and leave permanent marks. Wetting the windows and plants first protects them too.',
        effect: 'rinse',
      },
      {
        title: 'Foam on the mold-killing solution, ground up',
        body:
          'A foam cannon applies a bleach solution from the bottom of the wall to the top, so it soaks in evenly and does not run down in streaks. A pump sprayer handles the tight spots where I need to be precise.',
        effect: 'foam',
      },
      {
        title: 'Let it work',
        body:
          'The solution sits on the siding long enough to kill the mold and loosen the grime. That way the siding gets cleaned without blasting it with high pressure.',
        effect: 'dwell',
      },
      {
        title: 'Rinse from the top down',
        body:
          'I rinse from the roofline down, spraying almost parallel to the siding so the water carries the solution off the house instead of driving it in.',
        effect: 'clean',
      },
      {
        title: 'Rinse windows, plants and run-off points',
        body:
          'I give the windows another rinse so they don’t get that ugly bleach stain. Plants and the spots where water drains off the house get a thorough rinse too, so no solution builds up there.',
        effect: 'done',
      },
    ],
    care: [
      'Windows, plants and run-off spots are rinsed before and after.',
      'Bleach stays away from anything fabric, like furniture cushions and awnings.',
      'If the siding is oxidized, broken or very old and unpainted, I’ll tell you up front rather than risk damaging it.',
    ],
    beforeAfter: { alt: 'Vinyl siding before and after a house wash' },
  },
  {
    id: 'patio',
    part: 'patio',
    partLabel: 'Paver patio',
    name: 'Patio Cleaning & Restoration',
    tagline: 'Mold blasted out of every joint, then fresh polymeric sand. It looks brand new.',
    typicalTime: 'Full restoration: 2–3 days, because the patio has to dry completely before the sand goes in',
    steps: [
      walkThrough,
      {
        title: 'Rinse and treat the pavers',
        body:
          'The patio is rinsed with water first, then treated to kill the mold and grime that has built up on the pavers. Grime like that doesn’t just look bad. Over time it breaks the surface down.',
        effect: 'foam',
      },
      {
        title: 'Surface-clean the pavers',
        body:
          'A rounded surface cleaner goes over the whole patio, so it comes out even, without the stripes a wand can leave.',
        effect: 'clean',
      },
      {
        title: 'Blast the mold out of the joints',
        body:
          'This is the detail work. I go joint by joint and clear out the old sand, weeds and mold so nothing is left to grow back.',
        effect: 'clean',
      },
      {
        title: 'Let it dry completely',
        body:
          'Polymeric sand only sets properly in a dry patio, so this step can’t be rushed. It is why a restoration takes 2–3 days.',
        effect: 'dwell',
      },
      {
        title: 'Sweep in polymeric sand and set it',
        body:
          'New polymeric sand is swept into every joint and then set. It locks the pavers together and helps keep weeds out. If you only want a cleaning, we stop at the dry step.',
        effect: 'sand',
      },
    ],
    care: [
      'Working near a pool? I’ll let you know beforehand that some dirt may get in the water.',
      'Surfaces around the patio are rinsed so the solution doesn’t sit on plants.',
    ],
    beforeAfter: { alt: 'Paver patio before and after cleaning and resanding' },
  },
  {
    id: 'deck',
    part: 'deck',
    partLabel: 'Composite deck',
    name: 'Composite Deck Cleaning',
    tagline: 'A careful, low-pressure clean that lifts grime without scarring the boards.',
    typicalTime: 'About 2–3 hours, depending on the size of the deck',
    steps: [
      walkThrough,
      {
        title: 'Pre-rinse the deck and surroundings',
        body: 'The boards, railings and nearby plants are rinsed with water before any cleaning starts.',
        effect: 'rinse',
      },
      {
        title: 'Careful, low-pressure clean',
        body:
          'Composite can be scarred by too much pressure. I clean board by board at a pressure that lifts the grime and leaves the surface alone.',
        effect: 'clean',
      },
      {
        title: 'Final rinse',
        body: 'Everything is rinsed off so the deck dries clean and even, with no residue left between the boards.',
        effect: 'done',
      },
    ],
    care: [
      'Pressure is kept low on purpose. Too much can hurt the boards.',
      'If a deck is chewed up or rotting, I’ll tell you honestly instead of making it worse.',
    ],
    beforeAfter: { alt: 'Composite deck before and after cleaning' },
  },
  {
    id: 'fence',
    part: 'fence',
    partLabel: 'Fence',
    name: 'Fence Cleaning',
    tagline: 'Turbo-nozzle cleaning, with extra care for wood.',
    typicalTime: 'Depends on the size of the fence',
    steps: [
      walkThrough,
      {
        title: 'Rinse the fence line and plants',
        body: 'The fence and the garden beds along it are rinsed with water before cleaning.',
        effect: 'rinse',
      },
      {
        title: 'Turbo-nozzle clean',
        body:
          'A turbo nozzle spins the water into a tight, fast pattern that strips grime off the fence. On fences, it works like a charm.',
        effect: 'clean',
      },
      {
        title: 'Extra care on wood',
        body:
          'A little too much pressure hurts wood, so on wood sections I back off and keep a safe distance. I also keep bleach off wood entirely.',
        effect: 'clean',
      },
      {
        title: 'Final rinse',
        body: 'The whole run is rinsed down, including both sides where they can be reached, so it dries evenly.',
        effect: 'done',
      },
    ],
    care: ['No bleach on wood.', 'Gentler pressure and more distance on wood fences.'],
    beforeAfter: { alt: 'Fence before and after cleaning' },
  },
  {
    id: 'walkway',
    part: 'walkway',
    partLabel: 'Walkway & stairs',
    name: 'Walkway & Stair Cleaning',
    tagline: 'The first thing guests see, cleaned of slick mold and grime.',
    typicalTime: 'Usually part of a larger job. Ask about it during your walk-through',
    steps: [
      walkThrough,
      {
        title: 'Rinse and treat the mold',
        body: 'The walkway and steps are rinsed with water first, then treated so the mold and grime let go.',
        effect: 'foam',
      },
      {
        title: 'Surface-clean the walkway',
        body: 'The flat run of the walkway gets the surface cleaner for an even, streak-free finish.',
        effect: 'clean',
      },
      {
        title: 'Detail the stairs',
        body: 'Treads, risers and edges are cleaned by hand with the wand, so the corners match the rest.',
        effect: 'clean',
      },
      {
        title: 'Final rinse',
        body: 'Everything is rinsed off, including the beds along the edges.',
        effect: 'done',
      },
    ],
    care: ['Plants along the walkway are rinsed before and after.'],
    beforeAfter: { alt: 'Front walkway and stairs before and after cleaning' },
  },
  {
    id: 'mold-grime',
    part: 'driveway',
    partLabel: 'Any other surface',
    name: 'Mold & Grime Removal',
    tagline: 'Driveways, trim, steps, anything that needs it. Just ask.',
    typicalTime: 'Depends on the surface and the size of the area',
    steps: [
      {
        ...walkThrough,
        body:
          'Tell me exactly which surfaces you want done. Siding and decks are what I clean most, but I can clean any surface that needs it on request. We agree on it before I start.',
      },
      {
        title: 'Rinse first, always',
        body: 'Every surface is rinsed with water before any solution goes on, so it can’t react and leave marks.',
        effect: 'rinse',
      },
      {
        title: 'Treat the mold',
        body: 'A pump sprayer puts the solution exactly where it’s needed, and keeps it off fabric, wood and windows.',
        effect: 'foam',
      },
      {
        title: 'Clean and rinse',
        body: 'The surface is cleaned with the right tool for the job, then rinsed thoroughly to protect the plants around it.',
        effect: 'done',
      },
    ],
    care: ['Mold and grime don’t only look bad. Left alone, they wear surfaces out, and that costs more to fix later.'],
    beforeAfter: { alt: 'Surface before and after mold and grime removal' },
  },
];

export const serviceByPart = Object.fromEntries(services.map((s) => [s.part, s])) as Record<PartId, Service>;

export const partOrder: PartId[] = services.map((s) => s.part);

export const serviceTowns = [
  'Westford',
  'Chelmsford',
  'Groton',
  'Acton',
  'Tewksbury',
  'Littleton',
  'Lowell',
  'Ayer',
  'Burlington',
  'Concord',
  'Carlisle',
];
