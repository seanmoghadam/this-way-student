import React from "react";
import {Link} from "react-router-dom";
import {resetScrollPosition} from "../../helpers";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        resetScrollPosition();
    }


    render() {
        return <article id="landingPage">
            <section className="mapArea">
                <div className="mapArea__textContainer">
                    <h2 className="mapArea__textContainer__singleText">WE GUIDE YOU</h2>
                    <h2 className="mapArea__textContainer__singleText">THROUGH</h2>
                    <h2 className="mapArea__textContainer__singleText">VIENNA</h2>
                </div>
                <div className="mapArea__buttonContainer">
                    <Link to="/Routes"
                          className="btn btn-primary mapArea__buttonContainer__startButton">
                        START TOUR
                    </Link>
                </div>
            </section>
            <section className="introductionArea ">
                <h3>About ThisWay</h3>
                <p>ThisWay is a digital Tour Guide, which helps you navigating through Vienna.
                    Create, search and walk tours trough Vienna and enjoy the digital audioguides, which will definitly
                    give you lots of information about this beautiful city.</p>
                <section className="introductionArea__iconArea">
                    <div className="introductionArea__iconArea__singleIcon  leftUpper">
                        <p className={"introductionArea__iconArea__singleIcon__infoText"}>
                            Time independent
                        </p>
                        <img src="../images/svg/time-icon.svg" alt="Time independent"/>
                    </div>
                    <div className="introductionArea__iconArea__singleIcon ">
                        <p className={"introductionArea__iconArea__singleIcon__infoText"}>
                            Completely backed with audio material
                        </p>
                        <img src="../images/svg/music-player.svg" alt="Audio guided walks"/>
                    </div>
                    <div className="introductionArea__iconArea__singleIcon ">
                        <p className={"introductionArea__iconArea__singleIcon__infoText"}>
                            Matching to your postion
                        </p>
                        <img src="../images/svg/map.svg" alt="Guided tours with map"/>
                    </div>
                    <div className="introductionArea__iconArea__singleIcon  rightLower">
                        <p className={"introductionArea__iconArea__singleIcon__infoText"}>
                            Costumizable routes
                        </p>
                        <img src="../images/svg/track.svg" alt="Create tours"/>
                    </div>
                </section>


            </section>
            <section className="infoArea ">
                <h3>Audioguides</h3>
                <div className="infoArea__content">

                    <div>
                        <h2>Welcome to This-Way</h2>
                        <p>This is an Audio-Guide for Vienna with map instructions. You can
                            find many attractions and tours, which will show you places all over Vienna. Our audio
                            guides
                            are filled with the most important information´´ about many attractions. We are
                            improving are infromations every day so that our costumers get the best out of their holiday
                            in
                            Vienna.</p>
                    </div>
                    <img src="../images/ThisWay-Template.jpg" alt=""/>
                </div>

            </section>
            <section className="socialArea">
                <h4>Follow us on:</h4>
                <ul className="socialArea__socialIcons">
                    <li className="socialArea__socialIcons__iconContainer">
                        <a target="social" href="https://www.facebook.com" title="To Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                 version="1.1"
                                 id="Capa_1" x="0px" y="0px" viewBox="0 0 155.139 155.139" xmlSpace="preserve"
                                 width="512px"
                                 height="512px">
                                <g>
                                    <path id="f_1_"
                                          d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184   c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452   v20.341H37.29v27.585h23.814v70.761H89.584z"/>
                                </g>

                            </svg>
                        </a>
                    </li>
                    <li className="socialArea__socialIcons__iconContainer">
                        <a target="social" href="https://www.twitter.com" title="To Twitter">
                            <svg viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M 630, 425 A 195, 195 0 0 1 331, 600 A 142, 142 0 0 0 428, 570 A  70,  70 0 0 1 370, 523 A  70,  70 0 0 0 401, 521 A  70,  70 0 0 1 344, 455 A  70,  70 0 0 0 372, 460 A  70,  70 0 0 1 354, 370 A 195, 195 0 0 0 495, 442 A  67,  67 0 0 1 611, 380 A 117, 117 0 0 0 654, 363 A  65,  65 0 0 1 623, 401 A 117, 117 0 0 0 662, 390 A  65,  65 0 0 1 630, 425 Z"/>
                            </svg>
                        </a>
                    </li>
                    <li className="socialArea__socialIcons__iconContainer">
                        <a target="social" href="https://www.instagram.com" title="To Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                 aria-hidden="true" width="1536" height="1536"
                                 preserveAspectRatio="xMidYMid meet" viewBox="0 0 1536 1536">
                                <path
                                    d="M1024 768q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm138 0q0 164-115 279t-279 115-279-115-115-279 115-279 279-115 279 115 115 279zm108-410q0 38-27 65t-65 27-65-27-27-65 27-65 65-27 65 27 27 65zM768 138q-7 0-76.5-.5t-105.5 0-96.5 3-103 10T315 169q-50 20-88 58t-58 88q-11 29-18.5 71.5t-10 103-3 96.5 0 105.5.5 76.5-.5 76.5 0 105.5 3 96.5 10 103T169 1221q20 50 58 88t88 58q29 11 71.5 18.5t103 10 96.5 3 105.5 0 76.5-.5 76.5.5 105.5 0 96.5-3 103-10 71.5-18.5q50-20 88-58t58-88q11-29 18.5-71.5t10-103 3-96.5 0-105.5-.5-76.5.5-76.5 0-105.5-3-96.5-10-103T1367 315q-20-50-58-88t-88-58q-29-11-71.5-18.5t-103-10-96.5-3-105.5 0-76.5.5zm768 630q0 229-5 317-10 208-124 322t-322 124q-88 5-317 5t-317-5q-208-10-322-124T5 1085q-5-88-5-317t5-317q10-208 124-322T451 5q88-5 317-5t317 5q208 10 322 124t124 322q5 88 5 317z"/>
                                <rect x="0" y="0" width="1536" height="1536" fill="rgba(0, 0, 0, 0)"/>
                            </svg>
                        </a>
                    </li>
                </ul>

            </section>
        </article>;
    }


}
