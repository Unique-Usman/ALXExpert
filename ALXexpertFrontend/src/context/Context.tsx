import { createContext, ReactNode, useState } from "react";
import run from "../config/gemini";


export interface contextValueProps {
    input: string;
    setInput: (input: string) => void;
    recentPrompt: string;
    setRecentPrompt: (recentPrompt: string) => void;
    previousPrompts: string[];
    setPreviousPrompts: (previousPrompts: string[]) => void;
    showResult: boolean;
    setShowResult: (showResult: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    resultData: any;
    setResultData: (resultData: any) => void;
    onSent: (prompt?: string) => void;
    newChat: () => void;    
}

export const Context = createContext<contextValueProps>({
    input: '',
    setInput: () => {},
    recentPrompt: '',
    setRecentPrompt: () => {},
    previousPrompts: [],
    setPreviousPrompts: () => {},
    showResult: false,
    setShowResult: () => {},
    loading: false,
    setLoading: () => {},
    resultData: null,
    setResultData: () => {},
    onSent: () => {},
    newChat: () => {}
});

const ContextProvider = ({ children }: { children: ReactNode }) => {

    const [input, setInput] = useState<string>('');
    const [recentPrompt, setRecentPrompt] = useState<string>('');
    const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultData, setResultData] = useState<any>(null);


    function delayPara(index: number, nextWord: string) {
        setTimeout(function (){
            setResultData((prev: string) => prev + nextWord);
        }, 75  * index)
    }

    function newChat () {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt?: string  ) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response: string = "";
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        }else
        {
            setPreviousPrompts((prev: string[]) => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }
       
        let responseArray = response.split("**");
        let newResponse: string = ""; 
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || (i % 2) !== 1) {
                newResponse += responseArray[i];
            }else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }   
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            delayPara(i, newResponseArray[i] + " ");
        }
        setLoading(false);
        setInput("");
    }

    const contextValue = {
        input, setInput,
        recentPrompt, setRecentPrompt,
        previousPrompts, setPreviousPrompts,
        showResult, setShowResult,
        loading, setLoading,
        resultData, setResultData,
        onSent, newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export { ContextProvider };
