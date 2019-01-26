import React from "react";
import {compose, graphql} from "react-apollo";
import {AttractionsQuery} from "../../graphql/queries/attraction/attractionQueries";
import {setHeaders} from "../../helpers";
import Loading from "../Common/Loading";
import {AttractionList} from "./AttractionList";
import {AttractionOverview} from "./AttractionOverview";

class Attractions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.attractionsQuery.loading) {
            const attractions = this.props.attractionsQuery.Attractions;
            const headers = setHeaders("You can see here all available attractions from This-Way. Take your time and find" +
                " your best audio based Attraction in Vienna", "Attractions", this.props.location);
            if (this.props.list) {
                return <section id={"Attractions"} className={"contentContainer"}>
                    {headers}
                    <p className={"description"}>You can discover here all attractions which will appear in this route
                    </p>
                    <hr/>
                    <AttractionList attractions={attractions}/>
                </section>;
            } else {
                return <section id={"Attractions"} className={"contentContainer"}>
                    {headers}
                    <p className={"description"}>You can discover here all available attractions.
                    </p>
                    <hr/>
                    <AttractionOverview attractions={attractions}/>
                </section>;
            }
        } else {
            return <Loading/>;
        }
    }
}

export default compose(
    graphql(AttractionsQuery, {
        name: "attractionsQuery",
    }),
)(Attractions);