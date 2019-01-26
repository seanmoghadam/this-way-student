import React from "react";
import {compose, graphql} from "react-apollo";
import ImageGallery from "react-image-gallery";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Route} from "../../graphql/queries/route/routeQueries";
import {
    displayTotalDistance,
    displayTotalDuration,
    getRouteImages,
    logoutAndClear,
    resetScrollPosition,
    setHeaders
} from "../../helpers";
import {AttractionList} from "../Attractions/AttractionList";
import Comments from "../Common/Comments";
import Loading from "../Common/Loading";


class RouteDetails extends React.Component {
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
        if (!this.props.routeQuery.loading) {
            let route = this.props.routeQuery.SingleRoute;
            if (!route) {
                logoutAndClear(this.props.history, "/Error");
                return "";
            } else {
                return <section id={"RouteDetails"}>
                    {setHeaders(route.shortDescription, route.title, this.props.location)}


                    <article className="routeInfo contentContainer">
                        <ImageGallery items={getRouteImages(route.attractions)}
                                      showBullets={true}
                                      className="routeInfo__imageGallery"
                                      showThumbnails={false}
                                      showFullscreenButton={true}
                                      useBrowserFullscreen={true}
                        />
                        <h2 className="routeInfo__title">Route:<br/> {route.title}</h2>
                        <hr/>
                        <Tabs selectedIndex={this.state.tab}
                              onSelect={tab => {
                                  this.setState({tab});
                              }}
                              className={"routeInfo__tabs"}>
                            <TabList>
                                <Tab onClick={() => {
                                    this.handleUrlAndState(0);
                                }}>
                                    <h4>Info</h4>
                                </Tab>
                                <Tab onClick={() => {
                                    this.handleUrlAndState(1);
                                }}>
                                    <h4>Attractions</h4>
                                </Tab>
                                <Tab onClick={() => {
                                    this.handleUrlAndState(2);
                                }}>
                                    <h4>Comments</h4>
                                </Tab>
                            </TabList>
                            <TabPanel>
                                <div className="infoArea">
                                    <div className="infoArea__upper">
                                        <div>
                                            <p className="infoArea__upper__info headline">START:</p>
                                            <p className="infoArea__upper__info value">{route.startPoint}</p>
                                        </div>
                                        <div>
                                            <p className="infoArea__upper__info headline">END:</p>
                                            <p className="infoArea__upper__info value">{route.endPoint}</p>
                                        </div>


                                    </div>
                                    <div className="infoArea__lower">
                                        <div>
                                            <p className="infoArea__lower__info headline">Duration of route:</p>
                                            <p className="infoArea__lower__info value">
                                                {displayTotalDuration(route.duration)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="infoArea__lower__info headline">Distance of route:</p>
                                            <p className="infoArea__lower__info value">
                                                {displayTotalDistance(route.distance)}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                                <hr/>
                                <section className="routeInfo__description"
                                         dangerouslySetInnerHTML={{__html: route.description}}>

                                </section>
                            </TabPanel>
                            <TabPanel>
                                <AttractionList attractions={route.attractions}/>
                            </TabPanel>
                            <TabPanel>
                                <Comments ratings={route.ratings} type={"route"} id={this.props.match ? this.props.match.params.routeId : this.props.routeId}/>
                            </TabPanel>
                        </Tabs>


                    </article>


                </section>;
            }
        } else {
            return <Loading/>;
        }
    }
}

export default compose(
    graphql(Route, {
        name: "routeQuery",
        options: (props) => ({
            variables: {
                id: props.match.params.routeId,
            },
        }),
    }),
)(RouteDetails);