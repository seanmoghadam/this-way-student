import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {getLoggedInUser} from "../../graphql/queries/user/userQueries";
import {getIdFromToken, logoutAndClear} from "../../helpers";
import Loading from "../Common/Loading";

const userSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
        d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>
</svg>;

const attractionSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3.2"/>
    <path
        d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
</svg>;


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        if (!this.props.userQuery.loading) {
            !this.props.userQuery.UserById && logoutAndClear(this.props.history);
            return <div className="contentContainer" id="AdminDashboard">
                <h2>Dashboard</h2>
                <p className="description">
                    You can add, delete or update here your content for ThisWay!
                </p>
                <ul className="adminNavigation">
                    <li className="adminNavigation__listItem"><Link className="btn btn-primary"
                                                                    to={"/Admin/Users"}>Users {userSVG}</Link></li>
                    <li className="adminNavigation__listItem"><Link className="btn btn-primary"
                                                                    to={"/Admin/Routes"}>Routes <img
                        src="./images/svg/track.svg" alt=""/></Link></li>
                    <li className="adminNavigation__listItem"><Link className="btn btn-primary"
                                                                    to={"/Admin/Attractions"}>Attractions {attractionSVG}</Link>
                    </li>
                </ul>
            </div>;
        } else {
            return <Loading/>;

        }


    }

}

export default compose(
    graphql(getLoggedInUser, {
        name: "userQuery",
        options: () => ({
            fetchPolicy: "no-cache",
            variables: {
                input: getIdFromToken(),
            },
        }),
    }),
)(Dashboard);

