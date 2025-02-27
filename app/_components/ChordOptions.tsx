export const ChordOptions = {
  keys: [
      {label: 'C', value: 'C'},
      {label: 'C#', value: 'C#'},
      {label: 'D', value: 'D'},
      {label: 'D#', value: 'D#'},
      {label: 'E', value: 'E'},
      {label: 'F', value: 'F'},
      {label: 'F#', value: 'F#'},
      {label: 'G', value: 'G'},
      {label: 'G#', value: 'G#'},
      {label: 'A', value: 'A'},
      {label: 'A#', value: 'A#'},
      {label: 'B', value: 'B'}
  ],
  modes: [
      {label: 'M', value: 'M'},
      {label: 'm', value: 'm'}
  ],
  initialChords: [
    ['C4', 'E4', 'G4'],  
    ['D4', 'F4', 'A4'],
    ['E4', 'G4', 'B4'],
    ['F4', 'A4', 'C4'],
    ['G4', 'B4', 'D4'],
    ['A4', 'C4', 'E4'],
    ['B4', 'D4', 'F4']
],
initialDiatonicChord: {
      key: 'C',
      mm: 'M',
      one: 'C',
      two: 'Dm',
      three: 'Em',
      four: 'F',
      five: 'G',
      six: 'Am',
      seven: 'Bm(♭5)',
      chords: [
          {chordName:'C', first:'C4', third:'E4', fifth:'G4'},
          {chordName:'Dm', first:'D4', third:'F4', fifth:'A4'},
          {chordName:'Em', first:'E4', third:'G4', fifth:'B4'},
          {chordName:'F', first:'F4', third:'A4', fifth:'C4'},
          {chordName:'G', first:'G4', third:'B4', fifth:'D4'},
          {chordName:'Am', first:'A4', third:'C4', fifth:'E4'},
          {chordName:'Bm(♭5)', first:'B4', third:'D4', fifth:'F4'}
      ]
  }
};
