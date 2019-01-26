import {clone} from "ramda";
import React from "react";
import {compose, graphql} from "react-apollo";
import ImageGallery from "react-image-gallery";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Attraction} from "../../graphql/queries/attraction/attractionQueries";
import {logoutAndClear, resetScrollPosition, setHeaders} from "../../helpers";
import Comments from "../Common/Comments";
import Loading from "../Common/Loading";

const addImageClass = (images, className) => {
    const newImages = clone(images);

    return newImages.map((image) => {
        const newImage = Object.assign({}, image);
        newImage.originalClass = className;
        return newImage;
    });
};

class AttractionDetails extends React.Component {

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
        if (!this.props.attraction.loading) {

            const attraction = this.props.attraction.SingleAttraction;
            if (!attraction) {
                logoutAndClear(this.props.history, "/Error");
                return "";
            } else {
                return <section id={"AttractionDetails"}>
                    {!this.props.attractionId && setHeaders(attraction.shortDescription, attraction.title, this.props.location)}


                    <article className="attractionInfo contentContainer">
                        <ImageGallery
                            items={!this.props.attractionId ? attraction.images : addImageClass(attraction.images, "detailsGuide")}
                            showBullets={true}
                            className="attractionInfo__imageGallery"
                            showThumbnails={false}
                        />
                        <h2 className="attractionInfo__title">Attraction: {attraction.title}</h2>
                        <hr/>
                        <Tabs selectedIndex={this.state.tab}
                              onSelect={tab => {
                                  this.setState({tab});
                              }}
                              className={"attractionInfo__tabs"}>
                            <TabList>
                                <Tab onClick={() => {
                                    this.handleUrlAndState(0);
                                }}>
                                    <h4>Info</h4>
                                </Tab>
                                <Tab onClick={() => {
                                    this.handleUrlAndState(1);
                                }}>
                                    <h4>Comments</h4>
                                </Tab>
                            </TabList>
                            <TabPanel>
                                <section className="attractionInfo__description"
                                         dangerouslySetInnerHTML={{__html: attraction.description}}>
                                </section>
                            </TabPanel>
                            <TabPanel>
                                <Comments ratings={attraction.ratings} type={"attraction"} id={this.props.match ? this.props.match.params.attractionId : this.props.attractionId}/>
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
    graphql(Attraction, {
        name: "attraction",
        options: (props) => ({
            variables: {
                id: props.match ? props.match.params.attractionId : props.attractionId,
            },
        }),
    }),
)(AttractionDetails);