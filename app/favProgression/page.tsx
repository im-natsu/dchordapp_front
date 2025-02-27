"use client"

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FavProgression } from '../_interfaces/FavProgression';
import { createFavProgression, findAllFavProgression } from '../api/FavProgressions';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Tone from 'tone';
import Header from '../_components/Header';
import { DiatonicChord } from '../_interfaces/DiatonicChord';
import { ChordOptions } from '../_components/ChordOptions';
import { findAllDiactonicChords } from '../api/DiatonicChords';
import { RadioButton } from 'primereact/radiobutton';

export default function ChordProgressionPage() {
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [favProgressions, setFavProgressions] = useState<FavProgression[]>([]);
    const [name, setName] = useState('');
    const [chordInputs, setChordInputs] = useState({
        one: 'Ⅰ',
        two: 'Ⅳ',
        three: 'Ⅴ',
        four: 'Ⅰ',
        five: '',
        six: '',
        seven: '',
        eight: ''
    });
    const [loading, setLoading] = useState(true);
    const [audioLoading, setAudioLoading] = useState(false);
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
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
    
    const [playPattern, setPlayPattern] = useState<'normal' | 'rock' | 'ballad' | 'bossanova'>('normal');

    const rhythmPatternOptions = [
        { name: 'playPattern', value: 'normal', label: '通常再生' },
        { name: 'playPattern', value: 'rock', label: 'ロック (8ビート)' },
        { name: 'playPattern', value: 'ballad', label: 'バラード' },
        { name: 'playPattern', value: 'bossanova', label: 'ボサノバ' }
    ];

    const handleAudioInit = async () => {
        try {
            await Tone.start();
            setAudioLoading(false);
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
        } catch (error) {
            console.error('音声の初期化に失敗しました:', error);
        } finally {
            setAudioLoading(false);
        }
    };

    const keyChange = (e: any) => {
        setSelectedKeyOption({ label: e.value, value: e.value });
    };

    const mmChange = (e: any) => {
        setSelectedMmOption({ label: e.value, value: e.value });
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
            chordsResult.push(foundChord ? 
                [foundChord.first, foundChord.third, foundChord.fifth] : 
                []
            );
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

        const getFavProgressions = async () => {
            try {
                const response = await findAllFavProgression();
                setFavProgressions(response);
            } catch (error) {
                console.error('コード進行の取得に失敗しました:', error);
            }
        };

        handleAudioInit();
        getDiatonicChords();
        getFavProgressions();
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
    

    const degrees = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];

    const handleSave = async () => {
        const newProgression: FavProgression = {
            id: 0,
            name: name || '',
            one: chordInputs.one || 'Ⅰ',
            two: chordInputs.two || '',
            three: chordInputs.three || '',
            four: chordInputs.four || '',
            five: chordInputs.five || '',
            six: chordInputs.six || '',
            seven: chordInputs.seven || '',
            eight: chordInputs.eight || '',
            createdAt: new Date()
        };

        try {
            await createFavProgression(newProgression);
            const response = await findAllFavProgression();
            setFavProgressions(response);
            
            setName('');
            setChordInputs({
                one: 'Ⅰ',
                two: 'Ⅳ',
                three: 'Ⅴ',
                four: 'Ⅰ',
                five: '',
                six: '',
                seven: '',
                eight: ''
            });
        } catch (error) {
            console.error('Error saving chord progression:', error);
        }
    };

    const getActiveChords = (progression: FavProgression) => {
        return [
            progression.one,
            progression.two,
            progression.three,
            progression.four,
            progression.five,
            progression.six,
            progression.seven,
            progression.eight
        ].filter(chord => chord !== '');
    };

    const handlePlay = async (progression: FavProgression) => {
        if (!synth) {
            await handleAudioInit();
            if (!synth) return;
        }

        try {
            const activeChords = getActiveChords(progression);
            const tempoMap: Record<'normal' | 'rock' | 'ballad' | 'bossanova', number> = {
                normal: 80,
                rock: 100,
                ballad: 65,
                bossanova: 110
            };
            
            
            const tempo = tempoMap[playPattern];
            const beatDuration = 60000 / tempo;

            for (const degree of activeChords) {
                const index = degrees.indexOf(degree);
                if (index >= 0 && selectedDiatonicChord.chords[index]) {
                    switch (playPattern) {
                        case 'normal':
                            await synth.triggerAttackRelease(
                                selectedDiatonicChord.chords[index].map(note => note as Tone.Unit.Frequency),
                                '2n'
                            );
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            break;

                        case 'rock':
                            const rockPattern = [
                                { duration: '2n', interval: beatDuration * 0.4, velocity: 0.9 },
                                { duration: '4n', interval: beatDuration * 0.2, velocity: 0.6 },
                                { duration: '2n', interval: beatDuration * 0.4, velocity: 0.8 },
                                { duration: '4n', interval: beatDuration * 0.2, velocity: 0.6 }
                            ];
                            
                            for (let repeat = 0; repeat < 2; repeat++) {
                                for (const beat of rockPattern) {
                                    await synth.triggerAttackRelease(
                                        selectedDiatonicChord.chords[index].map(note => note as Tone.Unit.Frequency),
                                        beat.duration,
                                        undefined,
                                        beat.velocity
                                    );
                                    await new Promise(resolve => setTimeout(resolve, beat.interval));
                                }
                            }
                            break;

                        case 'ballad':
                            const notes = selectedDiatonicChord.chords[index];
                            for (let repeat = 0; repeat < 2; repeat++) {
                                await synth.triggerAttackRelease(
                                    [notes[0]] as Tone.Unit.Frequency[],
                                    '4n',
                                    undefined,
                                    0.9
                                );
                                await new Promise(resolve => setTimeout(resolve, beatDuration * 0.4));
                                await synth.triggerAttackRelease(
                                    notes.slice(1) as Tone.Unit.Frequency[],
                                    '4n',
                                    undefined,
                                    0.6
                                );
                                await new Promise(resolve => setTimeout(resolve, beatDuration * 0.4));
                            }
                            break;

                        case 'bossanova':
                            const bossaPattern = [
                                { duration: '8n', interval: beatDuration * 0.2, velocity: 0.8 },
                                { duration: '8n', interval: beatDuration * 0.15, velocity: 0.6 },
                                { duration: '8n', interval: beatDuration * 0.25, velocity: 0.7 },
                                { duration: '8n', interval: beatDuration * 0.2, velocity: 0.6 }
                            ];
                            
                            for (let repeat = 0; repeat < 2; repeat++) {
                                for (const beat of bossaPattern) {
                                    await synth.triggerAttackRelease(
                                        selectedDiatonicChord.chords[index].map(note => note as Tone.Unit.Frequency),
                                        beat.duration,
                                        undefined,
                                        beat.velocity
                                    );
                                    await new Promise(resolve => setTimeout(resolve, beat.interval));
                                }
                            }
                            break;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, beatDuration * 0.3));
                }
            }
        } catch (error) {
            console.error('Playback error:', error);
        }
    };

    const renderListItem = (progression: FavProgression) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{progression.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    {getActiveChords(progression).join(' → ')}
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Button icon="pi pi-play" rounded severity="success" onClick={() => handlePlay(progression)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItem = (progression: FavProgression) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3">
                        <div className="text-2xl font-bold">{progression.name}</div>
                        <div className="text-base">{getActiveChords(progression).join(' → ')}</div>
                        <Button icon="pi pi-play" rounded severity="success" onClick={() => handlePlay(progression)} />
                    </div>
                </div>
            </div>
        );
    };

    if (loading || audioLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7fa' }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="card">
                <div className="m-4">
                    <div className="flex flex-column gap-4">
                        <InputText
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="コード進行の名前をここに記載し、ディグリーをドロップダウンから選んで保存してね。ディグリーは4～8個まで選択できるよ。"
                        />
                        <div className="flex gap-2 flex-wrap">
                            {['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'].map((key) => (
                                <Dropdown
                                    key={key}
                                    value={chordInputs[key as keyof typeof chordInputs]}
                                    options={['', ...degrees]}
                                    onChange={(e) => {
                                        setChordInputs({
                                            ...chordInputs,
                                            [key]: e.value
                                        });
                                    }}
                                    placeholder={`${key}`}
                                />
                            ))}
                        </div>
                        <Button label="保存" onClick={handleSave} />
                    </div>
                </div>
                <div className="card">
                    <div>
                        <p>好きなキーと再生方法を選んで再生ボタンを押してね。</p>
                        <div className="flex align-items-center gap-3">
                            <div className="flex gap-2">
                                <Dropdown
                                    value={selectedKeyOption.value}
                                    options={keyOptions}
                                    onChange={keyChange}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="キーを選んで"
                                />
                                <Dropdown
                                    value={selectedMmOption.value}
                                    options={mmOptions}
                                    onChange={mmChange}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="M/m"
                                />
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {rhythmPatternOptions.map((option) => (
                                    <div key={option.value} className="flex align-items-center">
                                        <RadioButton
                                            inputId={option.value}
                                            name={option.name}
                                            value={option.value}
                                            onChange={(e) => setPlayPattern(e.value)}
                                            checked={playPattern === option.value}
                                        />
                                        <label htmlFor={option.value} className="ml-2">{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <DataView
                        value={favProgressions}
                        layout={layout}
                        itemTemplate={layout === 'grid' ? renderGridItem : renderListItem}
                        paginator
                        rows={9}
                        header={<DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as 'grid' | 'list')} />}
                    />
                </div>
            </div>
        </div>
    );
}