import playstore from "../../../images/playstore1.png"
import appstore from "../../../images/appstore1.png"
import "./footer.css"

function Footer()
{

    return (
        <>
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile phone</p>
                <a href="https://play.google.com/" target="_blank"><img src= {playstore} alt="playstore" /></a>
                <a href="https://www.apple.com/in/app-store/" target="_blank"><img src= {appstore} alt="appstore" /></a>
            </div>
            <div className="midFooter">
                <h1>E-COMMERCE</h1>
                <p>Best Quality and Prices right here</p>
            </div>
            <div className="rightFooter">
                <h4>Follow us</h4>
                <a href="https://github.com/Pedamalla-V-Laalith" target="_blank">Github</a>
                <a href="https://www.linkedin.com/in/v-laalith-pedamalla" target="_blank">LinkedIn</a>
                <a href="https://leetcode.com/u/PedamallaVLaalith/" target="_blank">Leetcode</a>
            </div>
        </footer>
        </>
    )
}

export default Footer