import React from "react";
import {Helmet} from "react-helmet";
import clientRoutes from "../../client/routes";
import serverRoutes from "../../server/routes";
import {setHeaders} from "../helpers";
import CookieBanner from "./Common/CookieBanner";
import Footer from "./Common/Footer";
import Home from "./Common/Home";
import {Navigation} from "./Navigation/Navigation";


export const AppHelmet = Helmet;

const desc = "Welcome to This-Way, an digital and fully backed Audio-Guide for your Device. You can explore all" +
    " parts of Vienna and visit many beautiful places.";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.ssrIsEnabled = this.ssrIsEnabled.bind(this);
        this.displayFooter = this.displayFooter.bind(this);
        this.state = {
            cookiesAccepted: false
        };
    }

    componentDidMount() {
        if (localStorage.getItem("acceptedCookies") === "true") {
            this.setState({cookiesAccepted: true});
        }
    }

    displayFooter(path) {
        return path.startsWith("/Guide") || path.startsWith("/Admin");
    }

    ssrIsEnabled() {
        return this.props.ssr ? serverRoutes : clientRoutes;
    }


    render() {
        return <div suppressHydrationWarning={true}>
            <Navigation {...this.props}/>
            {setHeaders(desc, undefined, this.props.location)}

            <div suppressHydrationWarning={true}>
                {this.props.location && this.props.location.pathname !== "/" ? this.ssrIsEnabled() : <Home/>}
                {this.props.location && !this.displayFooter(this.props.location.pathname) && <Footer/>}
                {!this.props.ssr && !this.state.cookiesAccepted && !this.props.location.pathname.startsWith("/Terms") &&
                <CookieBanner
                    onChange={() => this.setState({cookiesAccepted: true}, () => localStorage.setItem("acceptedCookies", "true"))}/>}
            </div>

        </div>;
    }

}
