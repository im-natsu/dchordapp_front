import { DiatonicChord } from "../_interfaces/DiatonicChord";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from "react";
import * as Tone from 'tone'

interface optionsProps{
  keyOptions : { label: String; value: String }[];
  mmOptions : { label: String; value: String }[];
  keyChange: (e: any) => void ;
  mmChange : (e: any) => void ;
  selectedKeyOption : { label: String; value: String };
  selectedMmOption : { label: String; value: String };
  selectedDiatonicChord : {diatonicChord : DiatonicChord; chords : String[][]}
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null;
}



export const DiatonicChordDisp = ({
  keyOptions, mmOptions, keyChange, mmChange,
  selectedKeyOption, selectedMmOption, selectedDiatonicChord, synth
}: optionsProps) => {
  const childSynth = synth ?? new Tone.PolySynth().toDestination();
  
  // 音を再生する共通関数
  const playChord = (chordIndex: number) => {
    const chordToPlay = selectedDiatonicChord.chords[chordIndex];
    if (chordToPlay && chordToPlay.length > 0) {
      const frequencies = chordToPlay.map(note => 
        Tone.Frequency(note.toString()).toFrequency()
      );
      childSynth.triggerAttackRelease(frequencies, '4n');
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center p-flex-column p-md-flex-row"
         style={{
           height: '100vh',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           gap: '20px',
           position: 'relative',
           background: '#f4f7fa'
         }}>
      <Dropdown
        value={selectedKeyOption.value}
        options={keyOptions}
        onChange={keyChange}
        optionLabel="label"
        optionValue="value"
        placeholder="C"
      />
      <Dropdown
        value={selectedMmOption.value}
        options={mmOptions}
        onChange={mmChange}
        optionLabel="label"
        optionValue="value"
        placeholder="M"
      />
      <div className="p-d-flex p-jc-center p-ai-center p-flex-wrap p-mb-4" 
           style={{ justifyContent: 'center' }}>
        {[
          { note: selectedDiatonicChord.diatonicChord.one, roman: 'Ⅰ' },
          { note: selectedDiatonicChord.diatonicChord.two, roman: 'Ⅱ' },
          { note: selectedDiatonicChord.diatonicChord.three, roman: 'Ⅲ' },
          { note: selectedDiatonicChord.diatonicChord.four, roman: 'Ⅳ' },
          { note: selectedDiatonicChord.diatonicChord.five, roman: 'Ⅴ' },
          { note: selectedDiatonicChord.diatonicChord.six, roman: 'Ⅵ' },
          { note: selectedDiatonicChord.diatonicChord.seven, roman: 'Ⅶ' },
        ].map(({ note, roman }, index) => (
          <Button
            key={index}
            label={`${note}\n${roman}`}
            onClick={() => playChord(index)}
            className="p-button-outlined p-m-2 custom-button"
            style={{ 
              fontSize: '1rem',
              whiteSpace: 'pre-line'
            }}
          />
        ))}
      </div>
    </div>
  );
};
