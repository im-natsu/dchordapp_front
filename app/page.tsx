"use client"

import React, { useEffect, useState } from 'react';
import { DiatonicChord } from './_interfaces/DiatonicChord';
import { findAllDiactonicChords } from './api/DiatonicChords';
import { DiatonicChordDisp } from './_components/DiatonicChord';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Tone from 'tone';
import Header from './_components/Header';
import { ChordOptions } from './_components/ChordOptions';
import { DropdownChangeEvent } from 'primereact/dropdown';

const IndexPage = () => {
  const [diatonicChords, setDiatonicChords] = useState<DiatonicChord[]>([]);
  const [selectedDiatonicChord, setSelectedDiatonicChord] = useState<{
    diatonicChord: DiatonicChord;
    chords: string[][];
  }>({
    diatonicChord: ChordOptions.initialDiatonicChord,
    chords: ChordOptions.initialChords
  });

  const [keyOptions] = useState<{ label: string; value: string }[]>(ChordOptions.keys);
  const [selectedKeyOption, setSelectedKeyOption] = useState<{ label: string; value: string }>({
    label: 'C',
    value: 'C'
  });

  const [mmOptions] = useState<{ label: string; value: string }[]>(ChordOptions.modes);
  const [selectedMmOption, setSelectedMmOption] = useState<{ label: string; value: string }>({
    label: 'M',
    value: 'M'
  });

  const [loading, setLoading] = useState(true);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);

  const keyChange = (e: DropdownChangeEvent) => {
    setSelectedKeyOption({ label: e.target.value, value: e.target.value });
  };
  
  const mmChange = (e: DropdownChangeEvent) => {
    setSelectedMmOption({ label: e.target.value, value: e.target.value });
  };

  const handleDiatonicChordUpdate = (diatonicChordresult: DiatonicChord) => {
    if (!diatonicChordresult) return;

    const chordsResult: string[][] = [];
    const degrees = [
      diatonicChordresult.one,
      diatonicChordresult.two,
      diatonicChordresult.three,
      diatonicChordresult.four,
      diatonicChordresult.five,
      diatonicChordresult.six,
      diatonicChordresult.seven
    ];

    for (const chordName of degrees) {
      const foundChord = diatonicChordresult.chords.find(
        chord => chord.chordName === chordName
      );
      
      if (foundChord) {
        chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
      } else {
        chordsResult.push([]);
      }
    }

    setSelectedDiatonicChord({
      diatonicChord: diatonicChordresult,
      chords: chordsResult
    });
  };

  useEffect(() => {
    const getDiatonicChords = async () => {
      setLoading(true);
      try {
        const response = await findAllDiactonicChords();
        if (response && response.length > 0) {
          setDiatonicChords(response);
          const initialChord = response.find(
            chord => chord.key === selectedKeyOption.value && 
            chord.mm === selectedMmOption.value
          );
          if (initialChord) {
            handleDiatonicChordUpdate(initialChord);
          }
        }
      } catch (error) {
        console.error('コードの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    const initSynth = async () => {
      await Tone.start();
      const limiter = new Tone.Limiter(-6).toDestination();
      const compressor = new Tone.Compressor({
        threshold: -24,
        ratio: 4,
        attack: 0.005,
        release: 0.1
      }).connect(limiter);

      const polySynth = new Tone.PolySynth(Tone.Synth, {
        volume: -12,
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).connect(compressor);

      setSynth(polySynth);
    };

    initSynth();
    getDiatonicChords();
  }, []);

  useEffect(() => {
    if (diatonicChords.length > 0) {
      const diatonicChordresult = diatonicChords.find(
        diatonicChord => 
          diatonicChord.key === selectedKeyOption.value && 
          diatonicChord.mm === selectedMmOption.value
      );
      
      if (diatonicChordresult) {
        handleDiatonicChordUpdate(diatonicChordresult);
      }
    }
  }, [selectedKeyOption, selectedMmOption, diatonicChords]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7fa' }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="contents">
        <DiatonicChordDisp
          keyOptions={keyOptions}
          mmOptions={mmOptions}
          keyChange={keyChange}
          mmChange={mmChange}
          selectedKeyOption={selectedKeyOption}
          selectedMmOption={selectedMmOption}
          selectedDiatonicChord={selectedDiatonicChord}
          synth={synth}
        />
      </div>
    </div>
  );
};

export default IndexPage;