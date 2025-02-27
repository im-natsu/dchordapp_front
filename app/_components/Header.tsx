"use client";

import React, { useEffect, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // テーマ
import 'primereact/resources/primereact.min.css';  // CSS
import 'primeicons/primeicons.css';  // アイコン
import { usePathname, useRouter } from "next/navigation";
import { ProgressSpinner } from 'primereact/progressspinner';

const HeaderBar = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);      
    if (pathname.startsWith('/trainingIndex')) {
      setActiveIndex(1);
    } else if (pathname === '/favProgression') {
      setActiveIndex(2);
    } else {
      setActiveIndex(0);
    }
    setLoading(false);      
  }, [pathname]);

  const items = [
    { label: '演奏', icon: 'pi pi-play', url: '/' },
    { label: 'トレーニング', icon: 'pi pi-link', url: '/trainingIndex' },
    { label: 'みんなのコード進行', icon: 'pi pi-users', url: '/favProgression' }
  ];

  const handleTabChange = (e: any) => {
    setActiveIndex(e.index);
    router.push(items[e.index].url);  // URLに遷移
  };

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      );
    }

  return (
    <div className="header-bar">
      <TabMenu model={items} activeIndex={activeIndex} onTabChange={handleTabChange} />
    </div>
  );
};

export default HeaderBar;