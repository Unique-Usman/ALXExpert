import "./Main.css";
import { assets } from '../../assets/assets';
import { useContext } from "react";
import { Context } from '../../context/Context';

export default function Main() {

    const { input, setInput,
        recentPrompt, setRecentPrompt,
        previousPrompts, setPreviousPrompts,
        showResult, setShowResult,
        loading, setLoading,
        resultData, setResultData,
        onSent } = useContext(Context);

    return (
        <div className="main">
            <div className="nav">
                <p>SuperVaani</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? <>
                    <div className="greet">
                        <p><span>Welcome to SuperVaani...</span></p>
                        <p>Curious About Plaksha? Ask now!</p>
                    </div>
                    <div className="cards">
                        <div className="card">
                            <p>Who are the professor in Machine Learning</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>What are the Student Club on Campus</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>What are the Laundry Timing</p>
                            <img src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Who is Anupam Sobti</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>
                    </div> </> : <div className="result">
                    <div className="result-title">
                        <img src={assets.user_icon}
                            alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading ? <div className="loader">
                            <hr />
                            <hr />
                            <hr />
                        </div> :
                            <p dangerouslySetInnerHTML={{ __html: resultData }}></p>}
                    </div>
                </div>}
                <div className="main-bottom">
                    <div className="search-box">
                        <input type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Enter a prompt here" />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input ? <img src={assets.send_icon} alt="" onClick={() => { onSent() }} />: null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        SuperVaani may display inacurate information, so double-check its response. Report any error to the Supervani team.
                    </p>
                </div>
            </div>
        </div>
    )
}
