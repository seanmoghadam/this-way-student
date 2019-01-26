import geolib from "geolib";
import {flatten} from "ramda";
import React from "react";
import {graphql} from "react-apollo";
import {geolocated} from "react-geolocated";
import {DirectionsRenderer, GoogleMap, Marker, OverlayView, withGoogleMap, withScriptjs,} from "react-google-maps";
import ScrollLock from "react-scrolllock";
import {CSSTransition} from "react-transition-group";
import {compose, lifecycle, withProps} from "recompose";
import {Route} from "../../graphql/queries/route/routeQueries";
import {getWayPoints, logoutAndClear, randomString, resetScrollPosition} from "../../helpers";
import AttractionDetails from "../Attractions/AttractionDetails";
import Loading from "../Common/Loading.jsx";
import {PopupContainer} from "../Common/PopupContainer";
import {MessagePopover} from "../Navigation/MessagePopover";
import PlayerNavigation from "../PlayerNavigation/PlayerNavigation";

const isChromeAndroid = typeof navigator !== "undefined" && /Chrome/.test(navigator.userAgent) && /GoogleInc/.test(navigator.vendor) && navigator.userAgent.match("Android");

const positionOfVienna = {lat: 48.208492, lng: 16.373755};

const getPixelPositionOffsetForToolTip = (width, height) => ({
    x: -(width / 2),
    y: -(height + 25),
});

const iconStyle = `img[src*="https://this-way.s3"]:not(.infoImage):not(.img-thumbnail):not(.detailsGuide) {
                        border-radius: 20px;
                        border: 1px solid white !important;
                        position: absolute;
                        }
                       `; //map override

const mapStyle = typeof window !== "undefined" ?
    (window.innerWidth > 500 ? {
        height: !isChromeAndroid ? `calc(100vh - 10em)` : `calc(100vh - 10em - 56px)`,
        marginTop: "5em"
    } : {height: `calc(100vh - 8.6em)`, marginTop: "calc(5em + 5px)"})
    : {};

const loadingStyle = typeof window !== "undefined" ?
    (window.innerWidth > 500 ? {
        height: !isChromeAndroid ? `calc(100vh - 10em)` : `calc(100vh - 10em - 56px)`,
        marginTop: "0px"
    } : {height: `calc(100vh - 3.7em)`, marginTop: "5px"})
    : {};


class Guide extends React.Component {


    constructor(props) {
        super(props);
        this.getDistanceTillPoint = this.getDistanceTillPoint.bind(this);
        this.makeMarker = this.makeMarker.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.checkIfStepReached = this.checkIfStepReached.bind(this);
        this.dataReloader = this.dataReloader.bind(this);
        this.displayInstructions = this.displayInstructions.bind(this);
        this.calculateRoute = this.calculateRoute.bind(this);

        this.state = {
            infoWindow: null,
            directions: undefined,
            zoom: 14,
            lat: this.props.lat,
            lng: this.props.lng,
            loadingText: "This-Way is loading the Application",
            currentAttraction: 0,
            currentStep: 0
        };
    }

    displayInstructions() {
        const {directions, currentStep, currentAttraction} = this.state;
        const route = directions.routes[0];

        if (route.legs[currentAttraction].steps[currentStep]) {
            return route.legs[currentAttraction].steps[currentStep].instructions;
        } else if (route.legs[currentAttraction + 1].steps[0]) {
            return route.legs[currentAttraction + 1].steps[0].instructions;
        } else {
            return "You have reached the destination";
        }
    }

    componentDidMount() {
        resetScrollPosition();

        const intervalId = setInterval(this.dataReloader, 1000);
        this.setState({intervalId});
        setTimeout(() => this.setState({
            noPositionAvailable: true, loadingText: "Could not obtain your location," +
            " wait or start anyway "
        }), 7000);


    }

    dataReloader() {
        const {lat, lng, directions, intervalId} = this.state;
        if (!lat || !lng || !directions || !this.props.coords) this.forceUpdate();
        else clearInterval(intervalId);
    }

    getDistanceTillPoint(customPoint) {
        const {lat, lng} = this.state;
        if (this.props.routeQuery.SingleRoute && lat && lng) {
            let currentAttraction = this.props.routeQuery.SingleRoute.attractions[0];
            return (((geolib.getDistance({latitude: lat, longitude: lng}, {
                latitude: customPoint ? customPoint.lat : currentAttraction.lat,
                longitude: customPoint ? customPoint.lng : currentAttraction.lng
            }, 10))) + " m");
        } else return 0;

    }

    handleMarkerClick(id, lat, lng) {
        this.center(lat, lng, 17);
        this.setState({
            infoWindow: id
        });
    }

    checkIfStepReached() {
        const {lat, lng, directions, currentStep, currentAttraction} = this.state;
        const route = directions.routes[0];
        const currentDirectionStep = route.legs[currentAttraction + 1] ? route.legs[currentAttraction].steps[currentStep] || route.legs[currentAttraction + 1].steps[0] : false;

        if (currentDirectionStep) {
            return geolib.isPointInCircle(
                {latitude: lat, longitude: lng},
                {
                    latitude: currentDirectionStep.end_point.lat(),
                    longitude: currentDirectionStep.end_point.lng()
                },
                30
            );
        }

    }

    center(customLat, customLng, defaultZoom) {
        this._googleMapComponent.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(defaultZoom);
        //could not achieve a better solution for upper code - tried it for hours - there is some major bug in reactmaps lib
        const {lat, lng} = this.state;
        this._googleMapComponent.panTo({lat: customLat || lat, lng: customLng || lng});
    }

    makeMarker(position, icon, title) {

        const google = this.props.google;
        new google.maps.Marker({
            position: position,
            icon: icon,
            title: title,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        //if user is not in vienna, show messages
        if (prevProps.coords) {
            let inVienna = Guide.checkIfUserIsInVienna(prevProps);
            !inVienna && this.setState({loadingText: "It seems that you are currently not in Vienna"});
        }
        //if everything is loaded and available
        if (prevProps.coords && !prevState.directions && !prevProps.routeQuery.loading && prevProps.google) {
            this.calculateRoute(prevProps);
        }
        if (prevState.noPosition) {
            if (!prevProps.routeQuery.loading && prevProps.google) this.calculateRoute(prevProps);
        }


    }

    calculateRoute(nextProps, noPosition) {
        console.log(nextProps);

        const {latitude, longitude} = !noPosition ? nextProps.coords : "";
        const route = nextProps.routeQuery.SingleRoute;
        const google = nextProps.google;
        const DirectionsService = new google.maps.DirectionsService();
        let waypoints = getWayPoints(route.attractions);

        const formattedWaypoints = waypoints.map(wayPoint => {
            return {
                location: new google.maps.LatLng(wayPoint[0], wayPoint[1]),
                stopover: true
            };
        }).slice(0, -1);
        console.log(formattedWaypoints);


        DirectionsService.route({
            origin: noPosition ? new google.maps.LatLng(waypoints[0][0], waypoints[0][1]) : new google.maps.LatLng(latitude, longitude),
            destination: new google.maps.LatLng(waypoints[waypoints.length - 1][0], waypoints[waypoints.length - 1][1]),
            travelMode: google.maps.TravelMode.WALKING,
            optimizeWaypoints: true,
            waypoints: noPosition ? formattedWaypoints.slice(1) : formattedWaypoints
        }, (result, status) => {
            console.log(result);
            if (status === google.maps.DirectionsStatus.OK) {
                let totalRouteDuration = result.routes[0].legs
                    .map(leg => leg.duration.value)
                    .reduce((a, b) => Math.ceil(a + b), 0);
                let totalAttractionsDuration = route.attractions
                    .map(attraction => attraction.duration / 1000)
                    .reduce((a, b) => Math.ceil(a + b), 0);
                let totalDistance = result.routes[0].legs
                    .map(leg => leg.distance.value)
                    .reduce((a, b) => Math.ceil(a + b), 0);
                const totalDuration = (totalAttractionsDuration + totalRouteDuration) * 1000;
                //costom marker

                this.setState({totalDistance, totalDuration, directions: result});
            } else {
                console.error(`error fetching directions ${result}`);
                this.setState(null);
            }
        });


    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.routeQuery.loading && nextProps.routeQuery.SingleRoute === null) {
            logoutAndClear(nextProps.history, "/Error");
        }
        if (!nextProps.isGeolocationAvailable && !nextProps.isGeolocationEnabled) {
            return {loadingText: "Could not optain your location, please try again later!"};
        }


        if ((!prevState.lng || !prevState.lng) && nextProps.coords) {
            return {
                lat: nextProps.coords.latitude,
                lng: nextProps.coords.longitude,
            };
        }
        let {currentStep, currentAttraction, loadingText} = prevState;
        let directions = nextProps.directions;
        let nextAttraction = currentAttraction;
        let nextStep = currentStep;
        let attractionMessage = false;
        let currentFile = undefined;


        if (nextProps.coords) {
            if (directions) {
                if (this.checkIfStepReached() && !directions.routes[0].legs[currentAttraction] || !directions.routes[0].legs[currentAttraction].steps[currentStep]) {
                    nextStep = 0;
                    nextAttraction = currentAttraction + 1;
                    currentFile = currentAttraction;
                    attractionMessage = nextProps.routeQuery.SingleRoute.attractions[currentAttraction] && {
                        icon: "success",
                        msg: ["You have reached: " + nextProps.routeQuery.SingleRoute.attractions[currentAttraction].title]
                    };
                } else if (this.checkIfStepReached()) {
                    nextStep = currentStep + 1;
                }
            }

            return {
                lat: nextProps.coords.latitude,
                lng: nextProps.coords.longitude,
                currentAttraction: nextAttraction,
                currentStep: nextStep,
                attractionMessage,
                currentFile,
                loadingText
            };

        }
        else return null;

    }

    static checkIfUserIsInVienna(props) {
        console.log(props);
        return geolib.getDistance({
            lat: props.coords.latitude,
            lng: props.coords.longitude,
        }, {
            lat: positionOfVienna.lat,
            lng: positionOfVienna.lng,
        }, 10) < 20000; // if user is in vienna
    }

    static handleManeuvers(currentStep) {

        if (currentStep) {
            switch (currentStep.maneuver) {
                case "turn-slight-left" : {
                    return <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 82.2 82.2" style="enable-background:new 0 0 82.2 82.2;"
                                xmlSpace="preserve">
                        <g>
                            <path d="M32.9,20.6l32.7,41.9c1.9,2.4,1.5,6.1-1,8c-2.4,1.9-6.1,1.5-8-1L27.3,32"/>
                            <path d="M28,33.4l-5.9,10c-0.2,0.4-0.7,0.6-1,0.4c-0.3-0.1-0.7-0.4-0.7-0.9l-0.2-28.4c0-0.3,0.1-0.6,0.4-0.8
		c0.2-0.2,0.5-0.3,0.9-0.2l27.4,7.2c0.2,0.1,0.4,0.2,0.5,0.3c0.1,0.2,0.2,0.4,0.2,0.6c-0.1,0.4-0.2,0.8-0.6,0.9L37.1,26l-0.4,0.3
		C36.9,26.5,27.8,33.2,28,33.4"/>
                        </g>
                    </svg>

                        ;
                }
                case "turn-slight-right" : {
                    return <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 82.2 82.2" style="enable-background:new 0 0 82.2 82.2;"
                                xmlSpace="preserve">
                        <g>
                            <path d="M61.5,28.1L29,70.1c-1.9,2.5-5.5,2.9-8,1s-2.9-5.5-1-8l29.1-37.5"/>
                            <path d="M47.8,26.5l-11.2-3.2c-0.4-0.1-0.7-0.6-0.6-0.8c0-0.4,0.3-0.8,0.7-0.9l27.5-7.2c0.3,0,0.6,0,0.9,0.2
		c0.2,0.2,0.4,0.4,0.4,0.8l-0.2,28.3c0,0.2-0.1,0.4-0.2,0.6c-0.1,0.2-0.3,0.3-0.5,0.4c-0.4,0.1-0.9,0-1-0.4l-6.3-10.7l-0.4-0.3
		C56.8,33.4,48,26.2,47.8,26.5"/>
                        </g>
                    </svg>


                        ;
                }
                case "turn-left" : {
                    return <svg version="1.2" baseProfile="tiny" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink" width="40px"
                                x="0px" y="0px" viewBox="0 0 82.2 82.2" xmlSpace="preserve">
                        <g>
                            <path d="M72.8,21.2v53.1c0,3.1-2.6,5.7-5.7,5.7c-3.1,0-5.7-2.6-5.7-5.7V26.8h-26c-0.1,0-0.2,0-0.4,0l4.3,10.8c0.2,0.4,0,0.9-0.3,1
		c-0.3,0.2-0.8,0.3-1.1,0L15.4,21.3c-0.2-0.2-0.4-0.5-0.4-0.8s0.1-0.6,0.4-0.8L37.9,2.5c0.2-0.1,0.4-0.2,0.6-0.2
		c0.2,0,0.4,0.1,0.6,0.2c0.3,0.3,0.5,0.7,0.3,1L34.8,15v0.5c0.2,0,0.4,0,0.7,0h31.6C70.2,15.5,72.8,18.1,72.8,21.2z"/>
                        </g>
                    </svg>
                        ;
                }
                case "turn-right" : {
                    return <svg version="1.2" baseProfile="tiny" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink" width="40px"
                                x="0px" y="0px" viewBox="0 0 82.2 82.2" xmlSpace="preserve">
                        <g>
                            <path d="M20.7,15.5h31.6c0.3,0,0.5,0,0.7,0V15L48.4,3.5c-0.2-0.3,0-0.7,0.3-1c0.2-0.1,0.4-0.2,0.6-0.2c0.2,0,0.4,0.1,0.6,0.2
		l22.5,17.2c0.3,0.2,0.4,0.5,0.4,0.8s-0.2,0.6-0.4,0.8L49.9,38.6c-0.3,0.3-0.8,0.2-1.1,0c-0.3-0.1-0.5-0.6-0.3-1l4.3-10.8
		c-0.2,0-0.3,0-0.4,0h-26v47.5c0,3.1-2.6,5.7-5.7,5.7S15,77.4,15,74.3V21.2C15,18.1,17.6,15.5,20.7,15.5z"/>
                        </g>
                    </svg>
                        ;
                }
                default : {
                    return <svg version="1.2" baseProfile="tiny" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 82.2 82.2"
                                xmlSpace="preserve">
                        <g>
                            <path d="M47.8,21.2v53.1c0,3.1-2.6,5.7-5.7,5.7s-5.7-2.6-5.7-5.7V26.8"/>
                            <path d="M36,28.3l-10.8,4.3c-0.4,0.2-0.9,0-1-0.3c-0.2-0.3-0.3-0.8,0-1.1L41.5,8.7c0.2-0.2,0.5-0.4,0.8-0.4s0.6,0.1,0.8,0.4
		l17.2,22.5c0.1,0.2,0.2,0.4,0.2,0.6c0,0.2-0.1,0.4-0.2,0.6c-0.3,0.3-0.7,0.5-1,0.3l-11.5-4.6h-0.5C47.3,28.3,36,28,36,28.3"/>
                        </g>
                    </svg>
                        ;
                }
            }
        }


    }


    render() {
        const {lat, lng, infoWindow, loadingText, currentAttraction, currentStep, directions} = this.state;


        if (!this.props.routeQuery.loading && this.props.google && directions) {

            const route = directions.routes[0];
            const {routeQuery, google} = this.props;
            const DBroute = routeQuery.SingleRoute;

            const currentDirectionStep = route.legs[currentAttraction] ? route.legs[currentAttraction].steps[currentStep] || route.legs[currentAttraction + 1] && route.legs[currentAttraction + 1].steps[0] : false;

            const audioFiles = flatten(DBroute.attractions.map(attraction => attraction.audioFiles.map(audioFile => {
                return {audioFile, title: attraction.title};
            })));

            return <section id="Guide" className="mapInput" onClick={(event) => {
                event.stopPropagation();
                this.setState({infoWindow: null});
            }}>
                <style>{/*{"styling icons - only possible inline"}*/}{iconStyle}</style>

                {!this.state.openPopup && <ScrollLock/>}

                <MessagePopover key={randomString}
                                message={this.state.attractionMessage}/>


                <section id="NavigationHeader" ref={(navigationHeader) => this._navigationHeader = navigationHeader}>
                    {!currentDirectionStep ?
                        <p className="endOfTour"> You have reached the end of the tour </p> :
                        <div className="navigationHeaderContainer">
                            <div className="navigationHeaderContainer__left">
                                {Guide.handleManeuvers(currentDirectionStep)}
                            </div>
                            <div className="navigationHeaderContainer__middle">
                                <div className="descriptionArea"
                                     dangerouslySetInnerHTML={{__html: this.displayInstructions()}}/>
                                <div
                                    className="distanceArea">{this.state.noPosition ? "No Info" : this.getDistanceTillPoint({
                                    lat: currentDirectionStep.start_point.lat(),
                                    lng: currentDirectionStep.start_point.lng(),
                                })}</div>
                            </div>
                            <div className="navigationHeaderContainer__right">
                                <button onClick={() => this.center(undefined, undefined, 17)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path
                                            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>}
                </section>
                <GoogleMap defaultZoom={14}
                           zoom={this.state.zoom}
                           ref={(it) => this._googleMapComponent = it}
                           defaultOptions={{
                               mapTypeControl: false,
                               streetViewControl: false,
                               fullscreenControl: false,
                               gestureHandling: "greedy"
                           }}
                           onClick={event => event.stop()}
                           defaultCenter={positionOfVienna}>
                    <DirectionsRenderer options={{suppressMarkers: true}} directions={this.state.directions}/>
                    {lat && lng && <Marker position={{lat, lng}} options={{icon: "/images/svg/userMap.svg"}}/>}
                    {DBroute && DBroute.attractions.map(attraction => {
                            const icon = new google.maps.MarkerImage(
                                attraction.images[0].original,
                                new google.maps.Size(34, 34),
                                new google.maps.Point(0, 0),
                                new google.maps.Point(17, 17),
                                new google.maps.Size(34, 34));
                            return <Marker key={attraction._id}
                                           clickable={true}
                                           defaultTitle={attraction.title}
                                           position={{lat: attraction.lat, lng: attraction.lng}}
                                           icon={icon}
                                           onClick={() => this.handleMarkerClick(attraction._id, attraction.lat, attraction.lng)}>
                                <CSSTransition
                                    in={infoWindow === attraction._id}
                                    timeout={50}
                                    classNames="overlayAnimation"
                                    unmountOnExit
                                >
                                    <OverlayView position={{lat: attraction.lat, lng: attraction.lng}}
                                                 mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                                 getPixelPositionOffset={getPixelPositionOffsetForToolTip}>
                                        <div className="mapAttractionOverlayView" onClick={() => {
                                            this.setState({openPopup: attraction._id});
                                        }}>
                                        <span className="mapAttractionOverlayView__close"
                                              onClick={(event) => {
                                                  event.stopPropagation();
                                                  this.setState({infoWindow: null});
                                              }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                            </svg>

                                        </span>
                                            <span
                                                className="mapAttractionOverlayView__distance">  {this.state.noPosition ? "42 m" : this.getDistanceTillPoint({
                                                lat: attraction.lat,
                                                lng: attraction.lng
                                            })} </span>
                                            <img src={attraction.images[0].original} width="250px" className={"infoImage"}/>
                                            <div className="mapAttractionOverlayView__textContainer">
                                                <span>{attraction.title}</span>
                                            </div>

                                        </div>
                                    </OverlayView>
                                </CSSTransition>
                            </Marker>;
                        }
                    )}

                    <PlayerNavigation playList={audioFiles}
                                      attractions={DBroute.attractions}
                                      handleAttractionClick={(id) => this.setState({openPopup: id})}
                                      currentFile={this.state.currentFile}
                    />

                </GoogleMap>


                {this.state.openPopup &&
                <PopupContainer childComponent={<AttractionDetails attractionId={this.state.openPopup}/>}
                                onClose={() => this.setState({openPopup: false})}/>}


            </section>;
        } else {
            return <Loading footSteps={true} customStyle={{
                position: "absolute",
                top: "5em",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
                outline: "none"
            }}
                            locationAvailable={this.props.coords && this.props.coords.latitude &&
                            this.props.isGeolocationAvailable &&
                            this.props.isGeolocationEnabled &&
                            !this.props.positionError}
                            text={loadingText}
                            handleNoPosition={(noPosition) => {
                                this.setState({noPosition});
                                if (noPosition) {
                                    !this.props.routeQuery.loading && this.props.google && Guide.calculateRoute(this.props, true);
                                }
                            }}
                            noPositionAvailable={this.state.noPositionAvailable}
            />;
        }

    }

}

export default compose(withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1Xl25f7VakjvA5DRriFO9wYLKtwGyoUE&libraries=places&language=en",
        loadingElement: <div style={loadingStyle}/>,
        containerElement: <div style={mapStyle}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }), withScriptjs,
    withGoogleMap,
    graphql(Route, {
        name: "routeQuery",
        options: (props) => ({
            variables: {
                id: props.match.params.routeId,
            },
            notifyOnNetworkStatusChange: true
        }),
    }),
    lifecycle({
        componentDidMount() {

            this.setState({
                google,
            });
        }
    }),
    geolocated({
        positionOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: Infinity,
        },
        watchPosition: true,
        userDecisionTimeout: null,
        suppressLocationOnMount: false,
        geolocationProvider: typeof navigator !== "undefined" ? navigator.geolocation : null
    }))(props => <Guide {...props}/>);

