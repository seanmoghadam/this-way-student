import React from "react";
import {Link} from "react-router-dom";

const style = `body {
overflow-y: hidden
}`;

export default class CookieBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <section id="CookieBanner">
            <style>{style}</style>

            <div className="cookieContainer">
                <h2>This-Way respects your private data</h2>
                <p> We use technologies such as cookies on our site to personalize content and optimize the
                    user-experience. <br/>
                    Click below to consent to the use of this technology across the web. You can change
                    your mind and change your consent choices at any time by returning to this site.
                </p>
                <Link to={"/Terms"}>Show data Usage</Link>
                <button className="btn btn-primary"
                        onClick={() => this.props.onChange()}>Accept
                </button>

            </div>


        </section>
            ;

    }
}
