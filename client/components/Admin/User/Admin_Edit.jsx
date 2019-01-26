import React from "react";
import {compose, graphql} from "react-apollo";
import {CSSTransition} from "react-transition-group";
import {validName} from "../../../../common/validation";
import {EditUserMutation} from "../../../graphql/mutations/user/userMutations";
import {AllUsersQuery, getLoggedInUser} from "../../../graphql/queries/user/userQueries";
import {logoutAndClear, resetScrollPosition} from "../../../helpers";
import Loading from "../../Common/Loading";


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
            forename: null,
            surname: null,
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
    }


    checkIfErrorExist() {
        const {forenameErrorMsg, surnameErrorMsg} = this.state;
        return forenameErrorMsg || surnameErrorMsg;
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

        }
        this.checkIfErrorExist();
    }

    handleSubmit(event) {
        event.preventDefault();
        const {
            forename,
            surname,

        } = this.state;


        this.props.editUser({
            variables: {
                input: {
                    forename,
                    surname,
                    id: this.props.match.params.userId
                },
            },
            update: (store, res) => {
                let newUserData = res.data.updateUser;
                try {
                    let storeData = store.readQuery({
                        query: getLoggedInUser,
                        variables: {
                            input: this.props.match.params.userId,
                        },
                    });
                    storeData.UserById.forename = newUserData.forename;
                    storeData.UserById.surname = newUserData.surname;
                    store.writeQuery({
                        query: getLoggedInUser, variables: {
                            input: this.props.match.params.userId,
                        }, data: storeData
                    });
                } catch (err) {
                }

                try {
                    let storeData2 = store.readQuery({
                        query: AllUsersQuery,
                    });
                    const selectedUser = storeData2.Users.find(user => user.email === newUserData.email);
                    selectedUser.forename = newUserData.forename;
                    selectedUser.surname = newUserData.surname;
                    store.writeQuery({
                        query: AllUsersQuery, data: storeData2
                    });
                } catch (err) {
                }
            }
        })
            .then(() => {
                this.setState({error: false});
                this.props.history.push({
                    pathname: "/admin/users/",
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
        } = this.state;

        const inputIsEmpty =
            forename === "" ||
            surname === "";

        if (!this.props.user.loading) {
            const user = this.props.user.UserById;
            if (!user) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <form onSubmit={this.handleSubmit} className={"form contentContainer"} id="signUpForm">
                    <h2>Edit Data of {user.forename}</h2>
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
        options: (props) => ({
            variables: {
                input: props.match.params.userId,
            },
        }),
    }),
)(Edit);
