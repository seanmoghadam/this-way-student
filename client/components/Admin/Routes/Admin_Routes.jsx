import {propEq, reject} from "ramda";
import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {RemoveRouteMutation} from "../../../graphql/mutations/route/routeMutations";
import {RoutesQueryLimited} from "../../../graphql/queries/route/routeQueries";


import {getLoggedInUser} from "../../../graphql/queries/user/userQueries";
import {
    displayTotalDistance,
    displayTotalDuration,
    getIdFromToken,
    logoutAndClear,
    resetScrollPosition
} from "../../../helpers";
import Loading from "../../Common/Loading";


class Admin_Routes extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.generateTableContent = this.generateTableContent.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);

        this.state = {
            tab: 0
        };
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }

    deleteRoute(id) {

        this.setState({deleting: true});
        this.props.removeRoute({
            variables: {
                id
            },
            update: (store) => {
                const data = store.readQuery({query: RoutesQueryLimited});
                data.Routes = reject(propEq("_id", id), data.Routes);
                store.writeQuery({query: RoutesQueryLimited, data});
            },
        }).then(() => {
            this.setState({deleting: false});
        });
    }

    generateTableContent(Routes) {
        return Routes.map((route, key) => {
            return <tr key={key + route.title}>
                <td data-title="Title">{route.title}</td>
                <td data-title="Duration">{displayTotalDuration(route.duration)}</td>
                <td data-title="Distance">{displayTotalDistance(route.distance)}</td>
                <td data-title="Actions" className="actions">
                    <Link to={"/Admin/Route/Edit/" + route._id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>

                    </Link>
                    <button className="btn-reset" onClick={() => this.deleteRoute(route._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24">
                            <path
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </td>
            </tr>;
        });
    }

    componentDidMount() {
        resetScrollPosition();
    }

    render() {
        if (!this.props.userQuery.loading && !this.props.routes.loading) {
            const routes = this.props.routes.Routes;

            if (!this.props.userQuery.UserById) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <section id="adminList" className="contentContainer">
                    <h2 className="title">Routes</h2>
                    <p className="description">You can edit, delete or update here any routes</p>
                    <hr/>
                    <div className="btn-container">
                        <Link to="Route/New" className="btn btn-success">New Route</Link>
                    </div>
                    <hr/>
                    <div className="table-responsive-vertical shadow-z-1">
                        <table id="table" className="table table-hover table-mc-light-blue">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Duration</th>
                                <th>Length</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.generateTableContent(routes)}
                            </tbody>
                        </table>
                    </div>
                </section>;

            }
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
    graphql(RoutesQueryLimited, {
        name: "routes",
    }),
    graphql(RemoveRouteMutation, {
        name: "removeRoute",
    })
)(Admin_Routes);