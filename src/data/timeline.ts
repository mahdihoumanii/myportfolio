export interface TimelineStop {
  id: string
  place: string
  period: string
  title: string
  org: string
  description: string
  tags: string[]
}

export const timeline: TimelineStop[] = [
  {
    id: 'beirut',
    place: 'Beirut',
    period: '2018 – 2021',
    title: 'B.Sc. Physics',
    org: 'Lebanese University',
    description:
      'Where it started: a foundation in classical mechanics, quantum mechanics, statistical physics, electrodynamics, and mathematical physics — and the decision to pursue theoretical physics seriously.',
    tags: ['Quantum mechanics', 'Statistical physics', 'Mathematical physics'],
  },
  {
    id: 'aachen',
    place: 'Aachen',
    period: '2022 – 2025',
    title: 'M.Sc. Physics — QFT & Gauge Theories',
    org: 'RWTH Aachen University',
    description:
      'Specialisation in quantum field theory and gauge theories, culminating in the thesis “Power Corrections for Top-Quark Pair Transverse-Momentum Distributions” under Prof. Michał Czakon: the Low–Burnett–Kroll expansion of massive five-point amplitudes beyond leading power, tree-level collinear regions from subleading terms of the one-loop soft expansion, and the matching of soft and collinear regions.',
    tags: ['Quantum field theory', 'Gauge theories', 'Power corrections'],
  },
  {
    id: 'rwth-research',
    place: 'Aachen · TTK',
    period: '2023 – 2024',
    title: 'Research in Theoretical Particle Physics',
    org: 'Institute for Theoretical Particle Physics and Cosmology, group of Prof. Michał Czakon',
    description:
      'Analytic tree-level and one-loop calculations for processes contributing to pp → tt̄g: massive five-point amplitudes, soft and collinear limits beyond leading power, expansion by regions, direct diagrammatic methods with finite-field reconstruction — in FORM, Fermat, Singular, and Mathematica, validated against MadGraph5_aMC@NLO.',
    tags: ['pp → tt̄g', 'Five-point amplitudes', 'Finite fields', 'MadGraph5_aMC@NLO'],
  },
  {
    id: 'siegen',
    place: 'Siegen',
    period: 'starting',
    title: 'PhD in Theoretical Particle Physics',
    org: 'Prof. Wolfgang Kilian · Cluster of Excellence “Color Meets Flavour”',
    description:
      'Starting doctoral research in top-quark physics within the Cluster of Excellence “Color Meets Flavour”, working directly with the ATLAS experiment at CERN on precision Standard Model phenomenology, collider observables, and computational methods for LHC physics.',
    tags: ['ATLAS experiment', 'Top-quark physics', 'Precision SM'],
  },
]
