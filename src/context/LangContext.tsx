'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface LangContextType {
    lang: string;
    setLang: Dispatch<SetStateAction<string>>;
}

const defaultLang = "en"; // 기본 언어를 상수로 정의
const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState(defaultLang);

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = useContext(LangContext);
    if (context === undefined) {
        throw new Error('useLang는 LangProvider 내부에서 사용해야 합니다.');
    }
    return context;
}