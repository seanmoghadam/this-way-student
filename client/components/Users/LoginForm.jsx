import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {CSSTransition} from "react-transition-group";
import {LoginQuery} from "../../graphql/queries/user/userQueries";
import {resetScrollPosition} from "../../helpers";


const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
};

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRetry = this.handleRetry.bind(this);
        this.state = {...INITIAL_STATE};
    }

    componentDidMount() {
        resetScrollPosition();
    }

    static blocked() {
        if (typeof localStorage !== "undefined") {
            let blocked = parseInt(localStorage.getItem("blocked"));
            if (blocked) {
                if (blocked <= Date.now()) {
                    localStorage.removeItem("blocked");
                    return false;
                } else return true;
            } else return false;

        }
    }

    handleRetry() {
        this.setState({
            error: true
        });
        if (typeof localStorage !== "undefined") {
            let blocked = localStorage.getItem("blocked");
            if (!blocked) {
                let counter = localStorage.getItem("try") !== null ? parseInt(localStorage.getItem("try")) : 1;
                let newCounter = counter + 1;
                if (counter !== undefined || counter !== null) {
                    if (newCounter > 3) {
                        let expire = Date.now() + 300000;
                        localStorage.setItem("blocked", JSON.stringify(expire));
                        localStorage.removeItem("try");
                    } else {
                        localStorage.setItem("try", JSON.stringify(newCounter));
                    }
                } else {
                    localStorage.setItem("try", "1");
                }
            }
        }

    }

    handleSubmit(event) {
        event.preventDefault();
        const {email, password} = this.state;
        if (email !== "" || password !== "") {
            this.props.login.refetch({
                email,
                password
            }).then((res) => {
                if (res && res.data && res.data.Login) {
                    localStorage.removeItem("try");
                    localStorage.setItem("token", res.data.Login.token);
                    localStorage.setItem("forename", res.data.Login.forename);
                    this.props.history.push({
                        pathname: "/",
                        state: {
                            msg: {
                                icon: "success",
                                msg: ["Successfully logged in!"]
                            }
                        }
                    });
                } else this.handleRetry();
            });
        } else this.handleRetry();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === "" ||
            email === "";

        let timeTillNextTry = () => {
            if (typeof localStorage !== "undefined") {
                let blockedUntil = parseInt(localStorage.getItem("blocked"));
                if (blockedUntil) {
                    return Math.ceil((blockedUntil - Date.now()) / 60000);
                }
            }
        };

        if (!LoginForm.blocked()) {
            return <form onSubmit={this.handleSubmit} className={"form contentContainer"} id={"loginForm"}>

                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        className={"form-control"}
                        value={email}
                        onChange={event => this.setState(byPropKey("email", event.target.value))}
                        type="text"
                        placeholder="Email Address"
                        name="email"
                        id="email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        className={"form-control"}
                        value={password}
                        onChange={event => this.setState(byPropKey("password", event.target.value))}
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                    />
                </div>
                <button disabled={isInvalid}
                        type="submit"
                        className="btn btn-primary">
                    Login
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                </button>
                <CSSTransition
                    in={error}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">Wrong E-Mail or password!</div>
                </CSSTransition>
                <div className={"noAccount"}>
                    No Account?
                    <Link to={"/SignUp"}>Register</Link>
                </div>

            </form>;
        }
        else {
            return <div className={"contentContainer"}>
                <div className={"error maxTryError"}>You have been blocked! Remaining time till
                    reactivation: {timeTillNextTry()} Minutes
                </div>
            </div>;
        }
    }

}


export default compose(
    graphql(LoginQuery,
        {
            name: "login",
            options: {
                delay: true,
                fetchPolicy: "no-cache",
                notifyOnNetworkStatusChange: true,
                variables: {
                    email: "",
                    password: ""
                }
            }
        }),
)(LoginForm);
