import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {getLoggedInUser} from "../../graphql/queries/user/userQueries";
import {formatMongoTime, getIdFromToken, logoutAndClear, resetScrollPosition} from "../../helpers";
import Loading from "../Common/Loading";
import SignOutButton from "./SignOutButton";


class User extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.state = {
            tab: 0
        };
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }


    componentDidMount() {
        resetScrollPosition();
    }

    render() {
        if (!this.props.user.loading) {
            const user = this.props.user.UserById;
            if (!user) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <section id={"User"}>

                    <article className="userInfo contentContainer">
                        <div className="userInfo__userImg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                        </div>

                        <h2 className="userInfo__title">Hi {user.forename} </h2>
                        <p className="userInfo__description">You can see here an overview of your personal
                            information!</p>
                        <hr/>
                        <div className="userInfo__infoArea">
                            <div className="userInfo__infoArea__upper">
                                <div>
                                    <p className="userInfo__infoArea__upper__info headline">Total distance walked:</p>
                                    <p className="userInfo__infoArea__upper__info value">14km</p>
                                </div>
                                <div>
                                    <p className="userInfo__infoArea__upper__info headline">Walked routes:</p>
                                    <p className="userInfo__infoArea__upper__info value">2</p>
                                </div>
                            </div>
                            <div className="userInfo__infoArea__lower">
                                <div>
                                    <p className="userInfo__infoArea__upper__info headline">Total time walked:</p>
                                    <p className="userInfo__infoArea__upper__info value">5 Hours and 34 Minutes</p>
                                </div>

                            </div>
                        </div>
                        <div className="userInfo__infoArea">
                            <div className="userInfo__infoArea__upper">
                                <div>
                                    <p className="userInfo__infoArea__upper__info headline">Account created:</p>
                                    <p className="userInfo__infoArea__upper__info value">{formatMongoTime(user.createdAt)}</p>
                                </div>
                            </div>

                        </div>

                        <div className="userInfo__buttonArea">
                            <Link to={"/User/Edit"}>
                                <button className="btn btn-primary detailsButton">Edit Data</button>
                            </Link>
                            <SignOutButton history={this.props.history}
                                           client={this.props.client}/>
                        </div>


                    </article>

                </section>;
            }
        } else {
            return <Loading/>;
        }
    }
}

export default compose(
    graphql(getLoggedInUser, {
        name: "user",
        options: () => ({
            variables: {
                input: getIdFromToken(),
            },
        }),
    }),
)(User);