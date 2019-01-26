import React from "react";
import {compose, graphql} from "react-apollo";
import {RoutesQuery} from "../../graphql/queries/route/routeQueries";
import {setHeaders} from "../../helpers";
import Loading from "../Common/Loading";
import {RouteOverview} from "./RouteOverview";


class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let routes = this.props.RoutesQuery.Routes;
        const headers = setHeaders("You can see here all available Tours from This-Way. Take your time and find" +
            " your best audio tour in Vienna", "Routes", this.props.location);
        if (!this.props.RoutesQuery.loading) {
            return <section id={"Routes"} className={"contentContainer"}>
                {headers}
                <p className={"description"}>You can see here an overview of all available tours. Just choose
                    the one you like and press "START TOUR".
                </p>
                <hr/>
                <RouteOverview routes={routes}/>
            </section>;
        } else {
            return <Loading/>;
        }
    }
}

export default compose(
    graphql(RoutesQuery, {
        name: "RoutesQuery",
    }),
)(Routes);