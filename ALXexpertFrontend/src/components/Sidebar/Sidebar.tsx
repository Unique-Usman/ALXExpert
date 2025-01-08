import "./Sidebar.css"
import { assets } from "../../assets/assets"
import { useState } from "react"
import { Context } from "../../context/Context"
import { useContext } from "react"
import { HiOutlineMenu } from "react-icons/hi";

export default function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { onSent, previousPrompts, setRecentPrompt, newChat} = useContext(Context);

  const loadPrompt = async (prompt: string) => {
    setRecentPrompt(prompt);
    onSent(prompt);
  }

  return (
    <div className="sidebar">
      <div className="top">
        <HiOutlineMenu onClick={() => setExtended(prev => !prev)} className="menu" />
        <div className="new-chat" onClick={() => newChat()}>
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {
          extended ?
            <div className="recent">
              <p className="recent-title">Recent</p>
              {
                previousPrompts.map((item: string, index: number) => {
                  return (
                    <div onClick={() => loadPrompt(item)} className="recent-entry">
                      <img src={assets.message_icon} alt="" />
                      <p>{item.slice(0, 80)}...</p>
                    </div>
                  )
                })
              }


            </div> : null
        }
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Setting</p> : null}
        </div>
      </div>
    </div>
  )
}
