'use client';

import React, { useState, useEffect} from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Tone from 'tone';
import Header from '@/app/_components/Header';
import { DiatonicChord } from '@/app/_interfaces/DiatonicChord';
import { findAllDiactonicChords } from '@/app/api/DiatonicChords';
import { useSearchParams } from 'next/navigation';

const TrainingPage = () => {
  const [diatonicChords, setDiatonicChords] = useState<DiatonicChord[]>([])
    const [selectedDiatonicChord, setSelectedDiatonicChord] = useState<{diatonicChord : DiatonicChord; chords : string[][]}>({diatonicChord : {
      key: "",
      mm: "",
      one: "",
      two: "",
      three: "",
      four: "",
      five: "",
      six: "",
      seven: "",
      chords: [],
    }, chords : []});
  const [selectedChords, setSelectedChords] = useState<{
      chords: string[],
      degree: string
    }[]>([]);  
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const searchParams = useSearchParams();  // クエリパラメータを取得

  // クエリパラメータを取得
  const level = searchParams.get('level');
  const key = searchParams.get('key');
  const mm = searchParams.get('mm');


  // 音を再生する関数
  const playChord = (chord: string[]) => {
        const limiter = new Tone.Limiter(-6).toDestination();
        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 4,
            attack: 0.005,
            release: 0.1
        }).connect(limiter);
  
        const polySynth = new Tone.PolySynth(Tone.Synth, {
          volume: -12,
          // Tone.Synth のオプションを直接渡す
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
          }
        }).connect(compressor);
        polySynth.triggerAttackRelease(chord, '8n');
  };

  // そのレベルで使用するダイアトニックコードを取り出す。
  const getUseChords = () => {
    let diatonicChordresult;
    setLoading(true);
    switch (level) {
      case '1':
        diatonicChordresult = diatonicChords.find(diatonicChord => diatonicChord.key === 'C' && diatonicChord.mm === 'M');
        break;
      case '2':
        diatonicChordresult = diatonicChords.find(diatonicChord => diatonicChord.key === key && diatonicChord.mm === mm);
        break;
      case '3':
        const randomIndex = Math.floor(Math.random() * diatonicChords.length);
        diatonicChordresult = diatonicChords[randomIndex];
        break;
      default:
        diatonicChordresult = undefined;
        break;
    }

  const chordsResult: string[][] = [];
  for (let i = 1; i < 8; i++) {
    let foundChord;
    switch (i) {
      case 1:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.one);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 2:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.two);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 3:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.three);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 4:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.four);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 5:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.five);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 6:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.six);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
      case 7:
        foundChord = diatonicChordresult?.chords.find(chord => chord.chordName === diatonicChordresult.seven);
        if (foundChord) {
          chordsResult.push([foundChord.first, foundChord.third, foundChord.fifth]);
        } else {
          console.log('Chord not found');
        }
        break;
    }
  }

  if (diatonicChordresult !== undefined && chordsResult !== undefined) {
    setSelectedDiatonicChord({
      diatonicChord: diatonicChordresult,
      chords: chordsResult,
    });
    } else {
      console.log("ダイアトニックコード取得エラー");
    }
    setLoading(false)
  }

  // ランダムなコードを4つ選ぶ
  const getRandomChords = () => {
    const shuffled = [...selectedDiatonicChord.chords]
      .map((chord, index) => ({
        chords: chord,
        degree: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'][index]
      }))
      .sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // サーバーサイドでは実行しない
  
    const getDiatonicChords = async () => {
      setLoading(true);
      try {
        const response = await findAllDiactonicChords();
        setDiatonicChords(response); // データをセット
      } catch (error) {
        console.error('コードの取得に失敗しました:', error);
      }
      setLoading(false);
    };
  
    getDiatonicChords();
  }, []); // 最初にデータを取得
  

  useEffect(() => {
    setLoading(true);
    if (diatonicChords.length > 0) {
      getUseChords()
      if(!loading){
      setSelectedChords(getRandomChords());
      }
    }
    setLoading(false);
  }, [diatonicChords]); // diatonicChords が更新されるたびに実行

  useEffect(() => {
    setSelectedChords(getRandomChords());
  }, [selectedDiatonicChord]); 


  const handleNoteClick = (degree: string) => {
    if (currentSelection.length < 4) {
      setCurrentSelection([...currentSelection, degree]);
  
      // chordArray を switch 文の外で宣言
      let chordArray: string[] = [];
  
      // degree によって chordArray を設定
      switch (degree) {
        case 'Ⅰ':
          chordArray = selectedDiatonicChord.chords[0].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅱ':
          chordArray = selectedDiatonicChord.chords[1].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅲ':
          chordArray = selectedDiatonicChord.chords[2].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅳ':
          chordArray = selectedDiatonicChord.chords[3].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅴ':
          chordArray = selectedDiatonicChord.chords[4].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅵ':
          chordArray = selectedDiatonicChord.chords[5].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        case 'Ⅶ':
          chordArray = selectedDiatonicChord.chords[6].map((note: string) => note.toString());
          playChord(chordArray);
          break;
        default:
          playChord([degree]); // その他の音符の場合はそのまま渡す
          return; // ここで関数を終了させる
      }
  
    }
  };
  const handleReset = () => {
    setCurrentSelection([]);  
  };

  const handleReplay = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
        const limiter = new Tone.Limiter(-6).toDestination();
        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 4,
            attack: 0.005,
            release: 0.1
        }).connect(limiter);
  
        const polySynth = new Tone.PolySynth(Tone.Synth, {
          volume: -12,
          // Tone.Synth のオプションを直接渡す
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
          }
        }).connect(compressor);    Tone.Transport.bpm.value = 160;
    
    selectedChords.forEach((item, index) => {
      Tone.Transport.schedule((time) => {
        // item.chordsを使用して音を再生
        polySynth.triggerAttackRelease(
          item.chords.map(note => note.toString()), // String[]型を文字列の配列に変換
          '4n',
          time
        );
      }, `${index}m`);
    });
    
    const duration = selectedChords.length * 1.5;
    Tone.Transport.start();
    
    setTimeout(() => {
      Tone.Transport.stop();
    }, duration * 1000);
  };
   
  
  const handleSubmit = () => {
    // すでに回答した場合は何もしない
    if (isAnswered) return;

    let correctCount = 0;
    const answers: string[] = [];
  
    currentSelection.forEach((selection, index) => {
      if (selection === selectedChords[index].degree) { // 音が一致するか確認
        console.log('selection',selection)
        console.log('selectedChords',selectedChords[index].degree)
        correctCount++;
        answers.push(`〇: ${selectedChords[index].degree}`);
      } else {
        console.log('selection',selection)
        console.log('selectedChords',selectedChords[index].degree)
        answers.push(`×: 正解は ${selectedChords[index].degree}`);
      }
    });
  
    setCorrectAnswers(answers);
    setIsAnswered(true);
  
    // すべて正解の場合にのみスコアを増加
    if (correctCount === selectedChords.length) {
      setScore(prevScore => prevScore + 1); // スコアを1増加
    }

  };

  const handleNextQuestion = () => {
    setSelectedChords(getRandomChords());
    setCurrentSelection([]);
    setIsAnswered(false);
    setCorrectAnswers([]);
    setCount(count + 1)
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh', background: '#f4f7fa', position: 'relative' }}>
        <p>第{count}問</p>
        {/* Play Sound Button - Right Top */}
        <Button
          label="再生"
          icon="pi pi-play"
          className="custom-button"
          onClick={handleReplay}
          style={{
            position: 'absolute',
            top: '30%',
            right: '20%',
          }}
        />
        <Button
          label="主音"
          icon="pi pi-volume-up"
          className="custom-button"
          onClick={() => playChord(selectedDiatonicChord.chords[0].map((note: string) => note.toString()))}
          style={{
            position: 'absolute',
            top: '38%', // 再生ボタンより少し下に配置
            right: '20%',
          }}
        />

        <div className="p-mb-4" style={{ textAlign: 'center' }}>
          <h3>選択された音</h3>
          <div>
            {currentSelection.map((note, index) => (
              <span
                key={index}
                style={{
                  margin: '0 8px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'green', // 選択された音の色を変更
                }}
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="p-d-flex p-jc-center p-ai-center p-flex-wrap p-mb-4" style={{ justifyContent: 'center' }}>
          {[
            { note: selectedDiatonicChord.diatonicChord.one.toString(), roman: 'Ⅰ' },
            { note: selectedDiatonicChord.diatonicChord.two.toString(), roman: 'Ⅱ' },
            { note: selectedDiatonicChord.diatonicChord.three.toString(), roman: 'Ⅲ' },
            { note: selectedDiatonicChord.diatonicChord.four.toString(), roman: 'Ⅳ' },
            { note: selectedDiatonicChord.diatonicChord.five.toString(), roman: 'Ⅴ' },
            { note: selectedDiatonicChord.diatonicChord.six.toString(), roman: 'Ⅵ' },
            { note: selectedDiatonicChord.diatonicChord.seven.toString(), roman: 'Ⅶ' },
          ].map(({ note, roman }, index) => (
            <Button
              key={index}
              label={`${note}\n${roman}`}
              className={`custom-button p-m-2 ${currentSelection.includes(note) ? 'p-button-success' : ''}`}
              onClick={() => handleNoteClick(roman)}
              style={{ fontSize: '1rem', transition: 'all 0.3s ease', whiteSpace: 'pre-line' }}
            />
          ))}
        </div>


        <div className="p-mb-4" style={{ textAlign: 'center' }}>
          <h3>結果</h3>
          <p>正解数: {score}</p>
          {isAnswered && (
            <div>
              <h4>詳細結果</h4>
              <ul>
                {correctAnswers.map((answer, index) => (
                  <li key={index} style={{ color: answer.startsWith('〇') ? 'green' : 'red' }}>
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          bottom: '35%',
          right: '20%',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}>
          <Button
            label="リセット"
            icon="pi pi-refresh"
            className="custom-button"
            onClick={handleReset}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
            }}
          />
          <Button
            label="回答"
            icon="pi pi-check"
            className="custom-button"
            onClick={handleSubmit}
          />
          <Button
            label={`次の問題`}
            icon="pi pi-arrow-right"
            className="custom-button"
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '1rem',
              padding: '0.5rem 1rem'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
