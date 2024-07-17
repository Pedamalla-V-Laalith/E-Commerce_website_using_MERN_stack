import "./About.css"
import Laalith_photo from "../../../images/Pedamalla_v_laalith.jpg"
import linkedin from "../../../images/linkedin.png"
import github from "../../../images/github.png"
import leetcode from "../../../images/leetcode.png"
 

function About(){


    return (
        <>
        <div className="aboutContainer">
            <div className="aboutCard">
                <h1>About Me</h1>
                <div className="myDetails">
                    <div>
                        <img alt="Profile Picture" src={Laalith_photo}/>
                        <br/>
                        <p>Pedamalla V Laalith</p>
                        <br/><br/>
                        <p>
                        This E-Commerce website project was completed by me with guidance 
                        from a YouTuber known as "6 Pack Programmer". 
                        The goal of this project was to learn modularity, state management, 
                        designing responsive UI/UX, and to expand my knowledge of writing 
                        code efficiently in both frontend and backend development 
                        using the MERN stack.
                        </p>
                    </div>
                    <div>
                        <h2>My Links</h2>
                        <br/>
                        <a href="https://www.linkedin.com/in/v-laalith-pedamalla" target="_blank"><img alt="LinkedIn" src={linkedin}/></a>
                        <br/>
                        <a href="https://github.com/Pedamalla-V-Laalith" target="_blank"><img alt="Github" src={github} /></a>
                        <br/>
                        <a href="https://leetcode.com/u/PedamallaVLaalith/" target="_blank"><img alt="Leetcode" src={leetcode} /></a>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


export default About