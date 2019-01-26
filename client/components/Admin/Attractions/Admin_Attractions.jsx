import moment from "moment";
import {propEq, reject} from "ramda";
import React from "react";
import {compose, graphql} from "react-apollo";
import {Link} from "react-router-dom";
import {RemoveAttractionMutation} from "../../../graphql/mutations/attraction/attractionMutations";
import {AttractionsQueryLimited} from "../../../graphql/queries/attraction/attractionQueries";
import {getLoggedInUser} from "../../../graphql/queries/user/userQueries";
import {getIdFromToken, logoutAndClear, resetScrollPosition} from "../../../helpers";
import Loading from "../../Common/Loading";
import LoadingIcon from "../../Common/LoadingIcon";


class Admin_Attractions extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.generateTableContent = this.generateTableContent.bind(this);
        this.deleteAttraction = this.deleteAttraction.bind(this);
        this.state = {
            tab: 0
        };
    }

    deleteAttraction(id) {

        this.setState({deleting: true});
        this.props.removeAttraction({
            variables: {
                id
            },
            update: (store) => {
                const data = store.readQuery({query: AttractionsQueryLimited});
                data.Attractions = reject(propEq("_id", id), data.Attractions);
                store.writeQuery({query: AttractionsQueryLimited, data});
            },
        }).then(() => {
            this.setState({deleting: false});
        });
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }

    generateTableContent(Attractions) {
        return Attractions.map((attraction, key) => {
            return <tr key={key + attraction.title}>
                <td data-title="Title">{attraction.title}</td>
                <td data-title="Duration">{moment(attraction.duration).utc().format("HH:mm")}</td>
                <td data-title="Actions" className="actions">
                    <Link to={"/Admin/Attraction/Edit/" + attraction._id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>

                    </Link>
                    <button className="btn-reset" onClick={() => this.deleteAttraction(attraction._id)}>
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
        if (!this.props.attractions.loading && !this.props.userQuery.loading) {
            if (!this.props.userQuery.UserById) {
                logoutAndClear(this.props.history);
                return "";
            } else {
                return <section id="adminList" className="contentContainer">
                    <h2 className="title">Attractions</h2>
                    <p className="description">You can edit, delete or update here any routes</p>
                    <hr/>
                    <div className="btn-container">
                        <Link to="Attraction/New" className="btn btn-success">New Attraction</Link>
                    </div>
                    <hr/>


                    <div className="table-responsive-vertical shadow-z-1">
                        <table id="table" className="table table-hover table-mc-light-blue">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.generateTableContent(this.props.attractions.Attractions)}
                            </tbody>
                        </table>
                    </div>
                    {this.state.deleting && <LoadingIcon text={"Deleting..."}/>}
                </section>;

            }
        } else {
            return <Loading/>;
        }
    }
}

export default compose(
    graphql(AttractionsQueryLimited, {
        name: "attractions",
    }),
    graphql(getLoggedInUser, {
        name: "userQuery",
        options: () => ({
            variables: {
                input: getIdFromToken(),
            },
            fetchPolicy: "no-cache",
        }),
    }),
    graphql(RemoveAttractionMutation, {
        name: "removeAttraction",
    })
)(Admin_Attractions);