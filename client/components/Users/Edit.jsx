import React from "react";
import {compose, graphql} from "react-apollo";
import {CSSTransition} from "react-transition-group";
import {validName, validPassword} from "../../../common/validation";
import {EditUserMutation} from "../../graphql/mutations/user/userMutations";
import {getLoggedInUser} from "../../graphql/queries/user/userQueries";
import {getIdFromToken, logoutAndClear, resetScrollPosition} from "../../helpers";
import Loading from "../Common/Loading";


const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAndSetMessage = this.validateAndSetMessage.bind(this);
        this.messageGenerator = this.messageGenerator.bind(this);
        this.checkIfErrorExist = this.checkIfErrorExist.bind(this);
        this.state = {
            forename: "",
            surname: "",
            passwordOne: "",
            passwordTwo: "",
            error: null,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.user.loading === false) {
            const userProps = nextProps.user.UserById;
            if (prevState.forename === null || prevState.surname === null)
                return {
                    forename: userProps.forename,
                    surname: userProps.surname
                };
            else return null;
        }
        return null;
    }


    messageGenerator(type = false, msg) {
        this.setState({
            [type + "ErrorMsg"]: type !== "password" ? "Invalid " + type + ", " + msg : msg,
            emailValidated: null
        });
    }

    componentDidMount() {
        resetScrollPosition();
        if (!this.props.user.loading) {
            const user = this.props.user.UserById;
            this.setState({
                forename: user.forename,
                surname: user.surname
            });
        }

    }


    checkIfErrorExist() {
        const {forenameErrorMsg, surnameErrorMsg, passwordOneErrorMsg, passwordTwoErrorMsg} = this.state;
        return forenameErrorMsg || surnameErrorMsg || passwordOneErrorMsg || passwordTwoErrorMsg;
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
            passwordOne,
            passwordTwo,
        } = this.state;


        this.props.editUser({
            variables: {
                input: {
                    forename,
                    surname,
                    passwordOne,
                    passwordTwo
                },
            },
            update: (store, res) => {
                try {
                    let newUserData = res.data.updateUser;
                    let storeData = store.readQuery({
                        query: getLoggedInUser,
                        variables: {
                            input: getIdFromToken(),
                        },
                    });
                    storeData.UserById.forename = newUserData.forename;
                    storeData.UserById.surname = newUserData.surname;
                    store.writeQuery({
                        query: getLoggedInUser, variables: {
                            input: getIdFromToken(),
                        }, data: storeData
                    });
                } catch (err) {
                }
            }
        })
            .then(() => {
                this.setState({error: false});
                this.props.history.push({
                    pathname: "/User",
                    state: {
                        msg: {
                            icon: "success",
                            msg: ["Successfully updated"]
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
            passwordOne,
            passwordTwo,
        } = this.state;

        const inputIsEmpty =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            forename === "" ||
            surname === "";

        if (!this.props.user.loading) {
            const user = this.props.user.UserById;
            if (!user) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <form onSubmit={this.handleSubmit} className={"form contentContainer"} id="signUpForm">
                    <h2>Edit your Data</h2>
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

                    <button className="btn btn-primary" type="submit"
                            disabled={inputIsEmpty || this.checkIfErrorExist()}>
                        Save Data
                    </button>
                    <button className="btn btn-danger" onClick={() => {
                        this.props.history.goBack();
                    }}>
                        Back
                    </button>
                </form>;
            }
        }
        else return <Loading/>;
    }
}

export default compose(
    graphql(EditUserMutation, {name: "editUser"}),
    graphql(getLoggedInUser, {
        name: "user",
        options: () => ({
            variables: {
                input: getIdFromToken(),
            },
        }),
    }),
)(Edit);
