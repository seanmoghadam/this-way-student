import React from "react";
import {DirectionsRenderer, GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";


const initialPosition = {lat: 48.210033, lng: 16.363449};

class FormMap extends React.Component {

    constructor(props) {
        super(props);
        this.onMapClick = this.onMapClick.bind(this);
        this.onPathAdd = this.onPathAdd.bind(this);
        this.passDataToParent = this.passDataToParent.bind(this);
        this.state = {
            directions: undefined,
            markerPosition: {
                lat: this.props.lat || initialPosition.lat,
                lng: this.props.lng || initialPosition.lng,
            },
            path: [{lat: -34.397, lng: 150.644}]
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.directions !== prevState.directions) {
            nextProps.onDirectionsReceived && nextProps.onDirectionsReceived(
                nextProps.directions,
                nextProps.totalDuration,
                nextProps.totalDistance
            );
            return {
                directions: nextProps.directions,
                totalDuration: nextProps.totalDuration,
                totalDistance: nextProps.totalDistance
            };
        }
        else return null;
    }


    passDataToParent() {
        const {markerPosition, path, directions, totalDuration, totalDistance} = this.state;
        this.props.handleChange && this.props.handleChange(markerPosition);
        this.props.handleChangedPolyLine && this.props.handleChangedPolyLine(path);
        this.props.onDirectionsReceived && this.props.onDirectionsReceived(directions, totalDuration, totalDistance);
    }

    onMapClick(e) {
        const position = e.latLng;
        this.setState({
            markerPosition: {lat: position.lat(), lng: position.lng()},
        }, this.passDataToParent);
    }

    onPathAdd(e) {
        const position = e.latLng;
        this.setState({
            path: [...this.state.path, {lat: position.lat(), lng: position.lng()}],
        }, this.passDataToParent);
    }

    render() {
        return this.state.directions ?
            <section id="formMap" className="mapInput">
                <GoogleMap defaultZoom={14}
                           defaultCenter={this.state.markerPosition}
                           onClick={this.props.polyLine ? this.onPathAdd : this.onMapClick}>
                    <DirectionsRenderer suppressMarkers={true} directions={this.state.directions}/>
                </GoogleMap>
            </section> :
            <section id="formMap" className="mapInput">
                <GoogleMap defaultZoom={14}
                           defaultCenter={this.state.markerPosition}
                           onClick={this.props.polyLine ? this.onPathAdd : this.onMapClick}>

                    {!this.props.polyLine && this.state.markerPosition !== initialPosition &&
                    <Marker position={this.state.markerPosition}/>}
                </GoogleMap>
            </section>;
    }

}

export default compose(withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1Xl25f7VakjvA5DRriFO9wYLKtwGyoUE&libraries=places&language=en",
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `400px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            const {startPoint, endPoint} = this.props;
            if (startPoint && endPoint && this.props.wayPoints) {
                let formattedWaypoints = this.props.wayPoints.map(wayPoint => {
                    return {
                        location: new google.maps.LatLng(wayPoint[0], wayPoint[1]),
                        stopover: true
                    };
                }).slice(1, -1);
                const DirectionsService = new google.maps.DirectionsService();
                DirectionsService.route({
                    origin: new google.maps.LatLng(startPoint[0], startPoint[1]),
                    destination: new google.maps.LatLng(endPoint[0], endPoint[1]),
                    travelMode: google.maps.TravelMode.WALKING,
                    optimizeWaypoints: true,
                    waypoints: formattedWaypoints
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        let totalRouteDuration = result.routes[0].legs
                            .map(leg => leg.duration.value)
                            .reduce((a, b) => Math.ceil(a + b), 0);
                        let totalAttractionsDuration = this.props.selectedAttractions
                            .map(attraction => attraction.duration / 1000)
                            .reduce((a, b) => Math.ceil(a + b), 0);
                        let totalDistance = result.routes[0].legs
                            .map(leg => leg.distance.value)
                            .reduce((a, b) => Math.ceil(a + b), 0);
                        const totalDuration = (totalAttractionsDuration + totalRouteDuration) * 1000;

                        this.setState({
                            totalDistance,
                            totalDuration,
                            directions: result,
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            }
        }
    }))(props => <FormMap {...props}/>);

