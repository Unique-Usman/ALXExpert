import "./Main.css";
import { assets } from '../../assets/assets';
import { useContext } from "react";
import { Context } from '../../context/Context';

export default function Main() {

    const { input, setInput,
        recentPrompt,
        
        showResult, 
        loading,
        resultData,
        onSent } = useContext(Context);

    return (
        <div className="main">
            <div className="nav">
                <p>ALXExpert</p>
                <img src={assets.alx_bot} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? <>
                    <div className="greet">
                        <p><span>Welcome to ALExpert...</span></p>
                        <p>Curious About ALX? Ask now!</p>
                    </div>
                    <div className="cards">
                        <div className="card">
                            <p>What is ALX About ?</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Is there any Student Support ?</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>What are the courses offered ALX</p>
                            <img src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>How much does ALX Charge ?</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>
                    </div> </> : <div className="result">
                    <div className="result-title">
                        <img src={assets.user_icon}
                            alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.alx_bot} alt="" />
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
                            {/* <img src={assets.gallery_icon} alt="" /> */}
                            {/* <img src={assets.mic_icon} alt="" /> */}
                            {input ? <img src={assets.send_icon} alt="" onClick={() => { onSent() }} />: null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        ALXExpert may display inacurate information, so double-check its response. Report any error to the ALXExpert team.
                    </p>
                </div>
            </div>
        </div>
    )
}
