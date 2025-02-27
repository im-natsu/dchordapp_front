"use client"
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Header from '../_components/Header';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import { RadioButton } from 'primereact/radiobutton';
import { ChordOptions } from '../_components/ChordOptions';

const TrainingIndexPage = () => {

  const [keyOptions, setKeyOptions] = useState<{ label: string; value: string }[]>(ChordOptions.keys);   // ドロップダウンの選択肢
  const [selectedKeyOption, setSelectedKeyOption] = useState<{ label: string; value: string }>({ label : 'C' , value : 'C'});

  const [mmOptions, setMmOptions] = useState<{ label: string; value: string }[]>(ChordOptions.modes);   // ドロップダウンの選択肢

  const [selectedMmOption, setSelectedMmOption] = useState<{ label: string; value: string }>({ label : 'M' , value : 'M'});
  const [loading, setLoading] = useState(false)

  const [level, setLevel] = useState(1);
  const router = useRouter();

  const keyChange = (e: DropdownChangeEvent) => {
    setSelectedKeyOption({ label: e.value, value: e.value }); // e.value を選択された値で更新
  };
  
  const mmChange = (e: DropdownChangeEvent) => {
    setSelectedMmOption({ label: e.value, value: e.value }); // e.value を選択された値で更新
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  const startQuiz = (level: number) => {
    let queryParams = '';
    if (level === 1) {
      queryParams = 'level=1';
    } else if (level === 2) {
      // selectedKeyOption.valueをエンコードしてURLに渡す
      const encodedKey = encodeURIComponent(selectedKeyOption.value); 
      queryParams = `level=2&key=${encodedKey}&mm=${selectedMmOption.value}`;
    } else if (level === 3) {
      queryParams = 'level=3';
    }
    router.push(`/trainingIndex/training?${queryParams}`);
  };

  return (
    
    <div>
      <Header />
      <div
        className="p-d-flex p-jc-center p-ai-center p-flex-column p-md-flex-row"
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          background: '#f4f7fa'
        }}
      >
        {/* レベル選択: ラジオボタンを縦に並べる */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <RadioButton
              inputId="level1"
              name="level"
              value={1}
              checked={level === 1}
              onChange={() => setLevel(1)}
            />
            <label htmlFor="level1">レベル1: Cメジャーダイアトニックコードのみ</label>
          </div>
          <div>
            <RadioButton
              inputId="level2"
              name="level"
              value={2}
              checked={level === 2}
              onChange={() => setLevel(2)}
            />
            <label htmlFor="level2">レベル2: キーを選んで挑戦</label>
          </div>
          <div>
            <RadioButton
              inputId="level3"
              name="level"
              value={3}
              checked={level === 3}
              onChange={() => setLevel(3)}
            />
            <label htmlFor="level3">レベル3: キーランダムで挑戦</label>
          </div>
        </div>

        {/* レベル1: Cメジャーダイアトニックコード */}
        {level === 1 && (
          <div>
            <h3>Cメジャーダイアトニックコード</h3>
            <ul>
              <li>C</li>
              <li>Dm</li>
              <li>Em</li>
              <li>F</li>
              <li>G</li>
              <li>Am</li>
              <li>Bm(♭5)</li>
            </ul>
            <Button label="トレーニング開始" onClick={() => startQuiz(1)} />
          </div>
        )}
        
        {/* レベル2: キーを選んで挑戦 */}
        {level === 2 && (
          <div>
            <h3>キーを選んで挑戦</h3>
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
            <Button label="トレーニング開始" onClick={() => startQuiz(2)} />
          </div>
        )}

        {/* レベル3: キーランダムで挑戦 */}
        {level === 3 && (
          <div>
            <h3>キーランダムで挑戦</h3>
            <Button label="トレーニング開始" onClick={() => startQuiz(3)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingIndexPage;