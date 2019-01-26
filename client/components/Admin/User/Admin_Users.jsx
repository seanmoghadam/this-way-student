import {propEq, reject} from "ramda";
import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {RemoveUserMutation} from "../../../graphql/mutations/user/userMutations";
import {AllUsersQuery, getLoggedInUser} from "../../../graphql/queries/user/userQueries";
import {getIdFromToken, logoutAndClear, resetScrollPosition} from "../../../helpers";
import Loading from "../../Common/Loading";


class User extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.generateTableContent = this.generateTableContent.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.state = {
            tab: 0
        };
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }

    removeUser(id) {
        this.setState({deleting: true});
        this.props.removeUser({
            variables: {
                id
            },
            update: (store) => {
                const data = store.readQuery({query: AllUsersQuery});
                data.Users = reject(propEq("_id", id), data.Users);
                store.writeQuery({query: AllUsersQuery, data});
            },
        }).then(() => {
            this.setState({deleting: false});
        });
    }

    generateTableContent(user, key) {
        if (user.email !== "admin@admin.admin") return <tr key={user._id + user.email + key}>
            <td title={user.email} data-title="Email">{user.email}</td>
            <td title={user.forename} data-title="Forename">{user.forename}</td>
            <td title={user.surname} data-title="Surname">{user.surname}</td>
            <td data-title="Actions" className="actions">
                <Link to={"/Admin/User/Edit/" + user._id}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24">
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>

                </Link>
                <button className="btn-reset" onClick={() => this.removeUser(user._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24">
                        <path
                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </td>
        </tr>;
    }


    componentDidMount() {
        resetScrollPosition();
    }

    render() {
        if (!this.props.usersQuery.loading && !this.props.userQuery.loading) {
            const users = this.props.usersQuery.Users;

            if (!this.props.userQuery.UserById || !users) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <section id="adminList" className="contentContainer">
                    <h2 className="title">Users</h2>
                    <p className="description">You can edit, delete or update here any user</p>


                    <div className="table-responsive-vertical shadow-z-1">
                        <table id="table" className="table table-hover table-mc-light-blue">
                            <thead>
                            <tr>
                                <th>Email</th>
                                <th>Forename</th>
                                <th>Surname</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, key) => this.generateTableContent(user, key))}
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
            variables: {
                input: getIdFromToken(),
            },
        }),
    }),
    graphql(AllUsersQuery, {
        name: "usersQuery",
    }),
    graphql(RemoveUserMutation, {
        name: "removeUser",
    }),
)(User);