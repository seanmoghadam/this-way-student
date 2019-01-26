import {difference} from "ramda";
import React from "react";
import {compose, graphql} from "react-apollo";
import {AddRouteMutation} from "../../../graphql/mutations/route/routeMutations";
import {AttractionsQuery} from "../../../graphql/queries/attraction/attractionQueries";
import {RoutesQueryLimited} from "../../../graphql/queries/route/routeQueries";
import {displayTotalDistance, displayTotalDuration, getWayPoints} from "../../../helpers";
import ClickAbleAttractions from "../../Attractions/ClickAbleAttractions";
import Loading from "../../Common/Loading";
import LoadingIcon from "../../Common/LoadingIcon";
import FormMap from "../../Map/FormMap";

const defaultState = {
    title: "",
    description: "",
    shortDescription: "",
    totalDuration: undefined,
    totalDistance: undefined,
    error: [],
    uploadLoading: false,
    routeCreated: false,
    selectedAttractions: null,
    directions: undefined,
};


class NewRoute extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateRoute = this.generateRoute.bind(this);
        this.state = defaultState;
        if (document) {
            this.ReactQuill = require("react-quill");
        }
    }

    componentWillUnmount() {
        this.setState(defaultState);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.AttractionsQuery.loading &&
            prevState.selectedAttractions === null) {
            return {
                attractions: nextProps.AttractionsQuery.Attractions,
                selectedAttractions: []
            };
        } else return null;

    }

    generateRoute() {
        event.preventDefault();
        this.setState({generatingRoute: true});
        let wayPoints = getWayPoints(this.state.selectedAttractions);
        this.setState({
            wayPoints,
            startPoint: wayPoints[0],
            endPoint: wayPoints[wayPoints.length - 1]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let {title, description, shortDescription} = this.state;
        let duration = this.state.totalDuration;
        let distance = this.state.totalDistance;
        let attractions = this.state.selectedAttractions.map(attraction => attraction._id);

        this.setState({
            uploadLoading: true
        });

        let startPoint = this.state.selectedAttractions[0].title;
        let endPoint = this.state.selectedAttractions[this.state.selectedAttractions.length - 1].title;


        this.props.AddRouteMutation({
            variables: {
                input: {
                    title, description, duration, distance, attractions, shortDescription, startPoint, endPoint
                },
            },
            update: (store, res) => {
                try {
                    let newRoute = res.data.addRoute;
                    let storeData = store.readQuery({query: RoutesQueryLimited});
                    storeData.Routes = [...storeData.Routes, newRoute];
                    store.writeQuery({query: RoutesQueryLimited, data: storeData});
                } catch (err) {

                }

            }
        }).then((route) => {
            if (route) {
                this.setState(defaultState, () => {
                    this.props.history.push({
                        pathname: "/Admin/Routes",
                        state: {
                            msg: {
                                icon: "success",
                                msg: ["Successfully created"]
                            }
                        }
                    });
                });
            }
        });
    }

    render() {

        const {
            title,
            description,
            shortDescription,
            attractions,
            routeCreated,
            totalDuration,
            totalDistance,
            selectedAttractions
        } = this.state;

        const ReactQuill = this.ReactQuill;

        const disabled = title === "" || description === "" || shortDescription === "" || !routeCreated;
        if (!this.props.AttractionsQuery.loading) {
            return <section id={"NewRoute"} className={"contentContainer"}>

                <h2 className={"description"}>
                    New Route
                </h2>

                <form action="" onSubmit={this.handleSubmit} className="newRouteForm">

                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control titleInput"
                           onChange={(newValue) => {
                               this.setState({
                                   title: newValue.target.value
                               });
                           }}
                           id="title"
                           value={title}
                           placeholder="Just enter the route-title!"
                    />

                    <hr/>

                    <label htmlFor="descr">Description</label>

                    {ReactQuill ? <ReactQuill id="descr"
                                              placeholder="Just paste you HTML code here or start typing your description!"
                                              className="descriptionInput"
                                              onChange={(description) => {
                                                  this.setState({
                                                      description
                                                  });
                                              }}
                                              value={description}
                    /> : null
                    }
                    <hr/>

                    <label htmlFor="shortDescr">Short Description</label>
                    <textarea className="form-control"
                              id="shortDescr"
                              rows={6}
                              placeholder="This will be used as short description and Meta-Description"
                              onChange={(item) => {
                                  this.setState({
                                      shortDescription: item.target.value
                                  });
                              }}>
                    </textarea>

                    <hr/>

                    <label htmlFor="availableAttractions">Attractions <small> (Click to add them to the route)</small>
                    </label>

                    <ClickAbleAttractions
                        attractions={selectedAttractions && attractions && difference(attractions, selectedAttractions)}
                        selectedAttractions={selectedAttractions}
                        onChange={(attractions) => {
                            this.setState({
                                selectedAttractions: attractions
                            });
                        }}/>

                    <div className="submitButton">
                        <button type="button" disabled={selectedAttractions.length === 0}
                                onClick={() => this.generateRoute()}
                                className="btn btn-primary">
                            {this.state.generatingRoute ? <LoadingIcon text={"Generating..."}/> : "Generate Route "}
                        </button>
                        <button type="button" disabled={!totalDistance || !totalDuration}
                                onClick={() => this.setState({
                                    uploadLoading: false,
                                    routeCreated: false,
                                    selectedAttractions: [],
                                    directions: undefined,
                                    wayPoints: [],
                                    totalDuration: undefined,
                                    totalDistance: undefined
                                })}
                                className="btn btn-danger">
                            Reset Route
                        </button>
                    </div>

                    <hr/>


                    {this.state.wayPoints && this.state.wayPoints.length !== 0 &&
                    <FormMap wayPoints={this.state.wayPoints} startPoint={this.state.startPoint}
                             endPoint={this.state.endPoint}
                             selectedAttractions={this.state.selectedAttractions}
                             onDirectionsReceived={(directions, totalDuration, totalDistance) => this.setState({
                                 directions,
                                 totalDistance,
                                 totalDuration,
                                 generatingRoute: false,
                                 routeCreated: true
                             })}/>}

                    {totalDuration &&
                    <label htmlFor="duration">Duration
                        <small>(in hours)</small>
                    </label>}

                    {totalDuration &&
                    <p>{displayTotalDuration(totalDuration)}</p>}


                    {totalDistance &&
                    <label htmlFor="distance">Distance</label>}

                    {totalDistance &&
                    <p>{displayTotalDistance(totalDistance)}</p>}


                    <div className="submitButton">
                        <button type="submit"
                                disabled={disabled}
                                className="btn btn-primary">
                            {this.state.uploadLoading ? <LoadingIcon text={"Uploading..."}/> : "Create Route "}
                        </button>
                    </div>


                </form>

            </section>;
        } else {
            return <Loading/>;
        }


    }
}

export default compose(
    graphql(AddRouteMutation, {
        name: "AddRouteMutation",
    }),
    graphql(AttractionsQuery, {
        name: "AttractionsQuery",
    }),
)(NewRoute);

