import React from "react";
import {NavLink} from "react-router-dom";
import Scrollock from "react-scrolllock";
import {CSSTransition} from "react-transition-group";
import {loggedIn, loggedInAndAdmin, randomString} from "../../helpers";
import logo from "../../images/ThisWay-Logo.png";
import SignOutButton from "../Users/SignOutButton";
import {BurgerIcon} from "./BurgerIcon";
import {MessagePopover} from "./MessagePopover";


export class Navigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            overlay: false
        };
        this.hideOverlay = this.hideOverlay.bind(this);
        this.showOverlay = this.showOverlay.bind(this);
    }

    hideOverlay() {
        this.setState({
            overlay: false
        });
    }

    showOverlay() {
        this.setState({
            overlay: true
        });
    }

    render() {
        const {overlay} = this.state;


        return <header id="navigationContainer">
            <div className="navigationPositioner">
                <nav suppressHydrationWarning={true} className="navigation">

                    <h1 className="navigation__logo">
                        <NavLink onClick={this.hideOverlay} to="/" className="navigation__logo__aTag">
                            <img src={logo} alt="ThisWay-Logo"
                                 className="navigation__logo__aTag__img"/>
                        </NavLink>
                    </h1>
                    {!loggedInAndAdmin() && this.props.location.pathname.indexOf("Admin") >= 0 ?
                        <h2 className={"adminText"}>ADMIN PANEL</h2> : null}
                    <div onClick={overlay ? this.hideOverlay : this.showOverlay} className="burgerContainer"
                         onKeyDown={(event) => {
                             if (event.key === "Enter") {
                                 !this.state.overlay ? this.showOverlay() : this.hideOverlay();
                             }
                             if (event.key === "Escape") this.hideOverlay();
                         }} tabIndex={0}>
                        <BurgerIcon overlay={overlay}/>
                    </div>
                </nav>
            </div>
            <MessagePopover key={randomString} message={this.props.location && this.props.location.state &&
            typeof this.props.location.state.msg !== "undefined" && this.props.location.state.msg}
                            history={this.props.history}/>
            <CSSTransition
                in={overlay}
                timeout={50}
                classNames="overlayAnimation"
                unmountOnExit
            >
                <div className="overlay">
                    <Scrollock/>
                    {loggedIn() ? (
                        <ul className="overlay__navList">
                            <li className="overlay__navList__item">
                                <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/">HOME</NavLink>
                            </li>

                            <li className="overlay__navList__item">
                                <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/Routes">ROUTES</NavLink>
                            </li>
                            {loggedInAndAdmin() ?
                                <li className="overlay__navList__item">
                                    <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                             onClick={this.hideOverlay}
                                             activeClassName={"activeNav"}
                                             to="/Admin">ADMIN</NavLink>
                                </li> :
                                <li className="overlay__navList__item">
                                    <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                             onClick={this.hideOverlay}
                                             activeClassName={"activeNav"}
                                             to="/User">YOUR PAGE</NavLink>
                                </li>}

                            <li className="overlay__navList__item">
                                <SignOutButton history={this.props.history}
                                               client={this.props.client}
                                               hideOverlay={this.hideOverlay}/>
                            </li>
                        </ul>
                    ) : (
                        <ul className="overlay__navList">
                            <li className="overlay__navList__item">
                                <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/">HOME</NavLink>
                            </li>
                            <li className="overlay__navList__item">
                                <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/Routes">ROUTES</NavLink>
                            </li>
                            <li className="overlay__navList__item">
                                <NavLink exact={true} className={"btn btn-primary overlay__navList__item__aTag"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/SignUp">NEW ACCOUNT
                                </NavLink>
                            </li>
                            <li className="overlay__navList__item">
                                <NavLink exact={true}
                                         className={"btn btn-primary overlay__navList__item__aTag loginButton"}
                                         onClick={this.hideOverlay}
                                         activeClassName={"activeNav"}
                                         to="/Login">LOGIN</NavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </CSSTransition>
        </header>;
    }
}