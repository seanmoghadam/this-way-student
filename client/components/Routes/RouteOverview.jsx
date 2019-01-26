import React from "react";
import ImageGallery from "react-image-gallery";
import {Link} from "react-router-dom";
import {CSSTransition} from "react-transition-group";
import {displayTotalDistance, displayTotalDuration, getRouteImages, loggedIn} from "../../helpers";
import {AttractionList} from "../Attractions/AttractionList";
import {PopupContainer} from "../Common/PopupContainer";


export class RouteOverview extends React.Component {

    constructor(props) {
        super(props);
        this.hidePopup = this.hidePopup.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.state = {
            popup: false
        };
    }

    showPopup() {
        this.setState({
            popup: true
        });
    }

    hidePopup() {
        this.setState({
            popup: false
        });
    }

    render() {
        return <ol id={"RouteOverview"}>
            {
                this.props.routes.map((route, index) => {
                    return <li key={route.title + index} className="singleRoute">

                        <figure className="singleRoute__imageAndDescription">
                            <ImageGallery items={getRouteImages(route.attractions)}
                                          showBullets={true}
                                          showThumbnails={false}
                                          className="singleRoute__imageAndDescription__img"
                            />
                            <figcaption className={"singleRoute__imageAndDescription__description"}>
                                <h3 className="title">
                                    {route.title}
                                </h3>
                                <article>
                                    {route.shortDescription}
                                </article>
                            </figcaption>
                        </figure>
                        <hr className={"singleRoute__hr"}/>
                        <div className="singleRoute__infoArea">
                            <div className="singleRoute__infoArea__upper">
                                <div>
                                    <p className="singleRoute__infoArea__upper__info headline">START:</p>
                                    <p className="singleRoute__infoArea__upper__info value">{route.startPoint}</p>
                                </div>
                                <div>
                                    <p className="singleRoute__infoArea__upper__info headline">END:</p>
                                    <p className="singleRoute__infoArea__upper__info value">{route.endPoint}</p>
                                </div>


                            </div>
                            <div className="singleRoute__infoArea__lower">
                                <div>
                                    <p className="singleRoute__infoArea__lower__info headline">Duration of route:</p>
                                    <p className="singleRoute__infoArea__lower__info value">
                                        {displayTotalDuration(route.duration)}
                                    </p>
                                </div>
                                <div>
                                    <p className="singleRoute__infoArea__lower__info headline">Distance of route:</p>
                                    <p className="singleRoute__infoArea__lower__info value">
                                        {displayTotalDistance(route.distance)}
                                    </p>
                                </div>

                            </div>
                        </div>
                        <div className="singleRoute__buttonArea">
                            <button className="btn btn-primary attractionsButton"
                                    onClick={() => this.setState({popup: index})}>Attractions
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                                </svg>
                            </button>
                            <Link to={"/Route/" + route._id} className="btn btn-primary detailsButton">
                                More Details
                            </Link>
                        </div>
                        <div className="singleRoute__buttonArea">
                            {loggedIn() ? <Link to={"/Guide/" + route._id} className="btn btn-success detailsButton"
                                                suppressHydrationWarning={true}>
                                START TOUR
                            </Link> : <Link to={"/Login"} className="btn btn-success detailsButton"
                                            suppressHydrationWarning={true}>
                                Log-In to Start
                            </Link>}
                        </div>
                        <CSSTransition
                            in={this.state.popup === index}
                            timeout={50}
                            classNames="overlayAnimation"
                            unmountOnExit
                        >
                            <PopupContainer onClose={() => this.hidePopup()}
                                            childComponent={
                                                <AttractionList
                                                    attractions={this.props.routes[index].attractions}
                                                />}
                            />
                        </CSSTransition>

                    </li>;
                })
            }
        </ol>;

    }
}

