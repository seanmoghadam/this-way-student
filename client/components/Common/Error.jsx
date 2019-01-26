//inspired by codepen example and adapted to react component with different styling
// https://codepen.io/marcobiedermann/pen/WbGazL

import React from "react";

export default class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){

    }


    render() {
        return <section id="Error" className="page-404">

            <div className="container">
                <div className="message animated bounceIn">
                    <div className="display-table">
                        <div className="display-table-cell">
                            <svg className="icon icon-left icon-x">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-x"></use>
                            </svg>
                        </div>
                        <div className="display-table-cell">
                            <h2>Error 404</h2>
                            <h3>Page not Found!</h3>
                        </div>
                    </div>
                </div>
            </div>
            <svg className="icons" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <symbol viewBox="0 0 512 512" id="icon-x"><title>x</title>
                    <path
                        d="M438.393 374.595L319.757 255.977l118.62-118.63-63.782-63.74-118.6 118.618-118.62-118.603-63.768 63.73 118.64 118.63L73.62 374.626l63.73 63.768 118.65-118.66 118.65 118.645z"/>
                </symbol>
            </svg>
        </section>;
    }


}
