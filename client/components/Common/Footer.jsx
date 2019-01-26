import React from "react";
import {Link} from "react-router-dom";


export default class Footer extends React.Component {

    render() {
        return <footer id={"Footer"} className="contentContainer">
            <Link to="/About">ABOUT</Link>
            <Link to="/Terms">TERMS</Link>
        </footer>;

    }
}
