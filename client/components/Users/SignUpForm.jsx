import React from "react";
import {compose, graphql} from "react-apollo";
import {CSSTransition} from "react-transition-group";
import validator from "validator";
import {validName, validPassword} from "../../../common/validation";
import {AddUserMutation} from "../../graphql/mutations/user/userMutations";
import {CheckIfEmailExistsQuery} from "../../graphql/queries/user/userQueries";
import {resetScrollPosition} from "../../helpers";


const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAndSetMessage = this.validateAndSetMessage.bind(this);
        this.messageGenerator = this.messageGenerator.bind(this);
        this.checkIfErrorExist = this.checkIfErrorExist.bind(this);
        this.checkIfEmailIsUnique = this.checkIfEmailIsUnique.bind(this);
        this.state = {
            forename: "",
            surname: "",
            email: "",
            passwordOne: "",
            passwordTwo: "",
            error: null,
        };
    }

    checkIfEmailIsUnique(email) {
        setTimeout(() => { //request delay
            this.setState({
                emailErrorMsg: "Checking..."
            });
            this.props.CheckIfEmailExists.refetch({
                input: email
            }).then((data) => {
                let emailExists = data.data && data.data.CheckIfEmailExists && data.data.CheckIfEmailExists.email;
                if (emailExists) {
                    this.setState({
                        emailErrorMsg: "This Email does already exist!",
                        emailValidated: null
                    });
                } else {
                    this.setState({
                        emailErrorMsg: null,
                        emailValidated: "Email is valid!"
                    });
                }
            });
        }, 100);


    }

    messageGenerator(type = false, msg) {
        this.setState({
            [type + "ErrorMsg"]: type !== "password" ? "Invalid " + type + ", " + msg : msg,
            emailValidated: null
        });
    }

    componentDidMount() {
        resetScrollPosition();
    }

    checkIfErrorExist() {
        const {forenameErrorMsg, surnameErrorMsg, emailErrorMsg, passwordOneErrorMsg, passwordTwoErrorMsg} = this.state;
        return forenameErrorMsg || surnameErrorMsg || emailErrorMsg || passwordOneErrorMsg || passwordTwoErrorMsg;
    }

    validateAndSetMessage(value, type) {
        switch (type) {
            case "forename":
            case "surname" : {
                if (value.length <= 0) {
                    this.setState({
                        [type + "ErrorMsg"]: undefined
                    });
                }
                else if (value.length <= 2) {
                    this.messageGenerator(type, "please provider a longer one");
                } else if (!validName(value)) {
                    this.messageGenerator(type, "please consider using only letters or '-,.");
                } else {
                    this.setState({
                        [type + "ErrorMsg"]: undefined
                    });
                }
                break;
            }
            case "email" : {
                if (value.length <= 0) {
                    this.setState({
                        [type + "ErrorMsg"]: undefined
                    });
                }
                else if (!validator.isEmail(value)) {
                    this.messageGenerator(type, "please consider using a valid email");
                } else if (this.checkIfEmailIsUnique(value)) {
                    this.messageGenerator(type, "please consider using a valid email");
                } else {
                    this.setState({
                        [type + "ErrorMsg"]: undefined
                    });
                }
                break;
            }
            case "password" : {
                if (value.length <= 0) {
                    this.setState({
                        ["passwordErrorMsg"]: undefined
                    });
                }
                else if (value.length <= 7) {
                    this.messageGenerator("password", "Please provide a longer password");
                } else if (!validPassword(value)) {
                    this.messageGenerator("password", "Please provide a stronger password, containing a lowercase letter, uppercase letter and a number");
                }
                else {
                    this.setState({
                        ["passwordErrorMsg"]: undefined
                    });
                }
                break;
            }
        }
        this.checkIfErrorExist();
    }

    handleSubmit(event) {
        event.preventDefault();
        const {
            forename,
            surname,
            email,
            passwordOne,
            passwordTwo,
        } = this.state;


        this.props.addUser({
            variables: {
                input: {
                    forename,
                    surname,
                    email,
                    passwordOne,
                    passwordTwo
                },
            },
        })
            .then(() => {
                this.setState({error: false});
                this.props.history.push({
                    pathname: "/Login",
                    state: {
                        msg: {
                            icon: "success",
                            msg: ["Successfully registered", "Check your mails to verify your account"]
                        }
                    }
                });
            })
            .catch(() => {
                this.setState({error: true});
            });


    }

    render() {
        const {
            forename,
            surname,
            email,
            passwordOne,
            passwordTwo,
        } = this.state;

        const inputIsEmpty =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            email === "" ||
            forename === "" ||
            surname === "";


        return <form onSubmit={this.handleSubmit} className={"form contentContainer"} id="signUpForm">
            <h2>New Account</h2>
            <div className={"form-group  " + (this.state.forenameErrorMsg ? "has-error" : "")}>
                <label htmlFor="forename">Forename</label>
                <CSSTransition
                    in={typeof this.state.forenameErrorMsg === "string"}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">{this.state.forenameErrorMsg}</div>
                </CSSTransition>
                <input className={"form-control"}
                       value={forename}
                       onChange={event => {
                           this.setState(byPropKey("forename", event.target.value), this.validateAndSetMessage(event.target.value, "forename"));
                       }}
                       type="text"
                       placeholder="Forename"
                       name="forename"
                       id="forename"
                />
            </div>
            <div className={"form-group " + (this.state.surnameErrorMsg ? "has-error" : "")}>
                <label htmlFor="surname">Surname</label>
                <CSSTransition
                    in={typeof this.state.surnameErrorMsg === "string"}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">{this.state.surnameErrorMsg}</div>
                </CSSTransition>
                <input className="form-control"
                       value={surname}
                       onChange={event => {
                           this.setState(byPropKey("surname", event.target.value), this.validateAndSetMessage(event.target.value, "surname"));
                       }}
                       type="text"
                       placeholder="Surname"
                       name="surname"
                       id="surname"
                />

            </div>
            <div className={"form-group " + (this.state.emailErrorMsg ? "has-error" : "")}>
                <label htmlFor="email">E-Mail</label>
                <CSSTransition
                    in={typeof this.state.emailErrorMsg === "string"}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">{this.state.emailErrorMsg}</div>
                </CSSTransition>
                <CSSTransition
                    in={typeof this.state.emailValidated === "string"}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="success">{this.state.emailValidated}</div>
                </CSSTransition>
                <input className="form-control"
                       value={email}
                       onChange={event => {
                           this.setState(byPropKey("email", event.target.value), this.validateAndSetMessage(event.target.value, "email"));
                       }}
                       type="text"
                       placeholder="Email Address"
                       name="email"
                       id="email"
                />


            </div>
            <div className={"form-group " + (this.state.passwordErrorMsg ? "has-error" : "")}>
                <label htmlFor="password">Password</label>
                <CSSTransition
                    in={typeof this.state.passwordErrorMsg === "string"}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">{this.state.passwordErrorMsg}</div>
                </CSSTransition>
                <input className="form-control"
                       value={passwordOne}
                       onChange={event => {
                           this.setState(byPropKey("passwordOne", event.target.value), this.validateAndSetMessage(event.target.value, "password"));
                       }}
                       type="password"
                       placeholder="Password"
                       name="password"
                       id="password"
                />
            </div>
            <div className={"form-group " + (this.state.passwordErrorMsg ? "has-error" : "")}>
                <label htmlFor="password_retry">Verify password</label>
                <CSSTransition
                    in={this.state.passwordTwo !== this.state.passwordOne}
                    timeout={200}
                    classNames="overlayAnimation"
                    unmountOnExit>
                    <div className="error">Passwords do not match!</div>
                </CSSTransition>
                <input className="form-control"
                       value={passwordTwo}
                       onChange={event => {
                           this.setState(byPropKey("passwordTwo", event.target.value), this.validateAndSetMessage(event.target.value, "password"));
                       }}
                       type="password"
                       placeholder="Confirm Password"
                       name="password_retry"
                       id="password_retry"
                />

            </div>
            <CSSTransition
                in={typeof this.checkIfErrorExist() === "string" || inputIsEmpty}
                timeout={200}
                classNames="overlayAnimation"
                unmountOnExit>
                <div className={"infoArea"}>
                    {typeof this.checkIfErrorExist() === "string" && <p>Please check your inputs!</p>}
                    {inputIsEmpty && <p>All fields are required!</p>}
                </div>
            </CSSTransition>
            <p className="terms">By clicking "Create Account", you agree to our <a href="/Terms">Terms and
                Conditions</a> . </p>
            <button className="btn btn-primary" type="submit" disabled={inputIsEmpty || this.checkIfErrorExist()}>
                Create Account
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </button>
        </form>;

    }

}

export default compose(
    graphql(AddUserMutation, {name: "addUser"}),
    graphql(CheckIfEmailExistsQuery,
        {
            name: "CheckIfEmailExists",
            options: {
                delay: true,//prevents initial fetch on component mount
                notifyOnNetworkStatusChange: true, //force loading if load stuck (bug preventation)
                variables: {
                    input: ""
                }
            }
        }
    )
)(SignUpForm);
