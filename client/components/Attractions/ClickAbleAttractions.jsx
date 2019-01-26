import {find, propEq} from "ramda";
import React from "react";

const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
export default class ClickAbleAttractions extends React.Component {

    constructor(props) {
        super(props);
        this.passAttractionsToParent = this.passAttractionsToParent.bind(this);
        this.state = {
            attractions: this.props.attractions || [],
            selectedAttractions: this.props.selectedAttractions || [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedAttractions !== prevState.selectedAttractions) return {
            attractions: nextProps.attractions,
            selectedAttractions: nextProps.selectedAttractions
        };
        else return null;
    }

    passAttractionsToParent(attraction, index) {
        if (!find(propEq("title", attraction.title), this.state.selectedAttractions)) {
            let attractions = this.state.attractions;
            delete attractions[index];
            attractions = attractions.filter(function (n) {
                return n !== undefined;
            });
            this.setState({
                selectedAttractions: [...this.state.selectedAttractions, attraction],
                attractions
            }, () => this.props.onChange && this.props.onChange([...this.state.selectedAttractions, attraction]));
        }
    }

    render() {
        return <div>
            <p className="alert alert-info">Select them in the right order, otherwise the tour could get unnecessary
                long</p>

            <ul id={"ClickAbleAttractions"}>
                {
                    this.state.attractions.length >= 0 && this.state.attractions.map((attraction, index) => {

                        return <li key={attraction.title + index}
                                   className="singleRoute"
                                   onClick={() => this.passAttractionsToParent(attraction, index)}
                                   title="Add attraction to route">
                            <figure className="singleRoute__imageAndDescription">
                                <img className="img-thumbnail" src={attraction.images[0].original}
                                     alt={attraction.title}/>
                                <figcaption className={"singleRoute__imageAndDescription__description"}>

                                    <h3 className="title">
                                        {attraction.title}
                                    </h3>
                                </figcaption>
                            </figure>
                        </li>;
                    })
                }
                {
                    this.state.attractions.length === 0 && <p>There are currently no attractions left</p>
                }

            </ul>
            <hr/>
            {this.state.selectedAttractions.length > 0 && <label>Selected attractions
                <small> (Click them to remove them from the tour)</small>
            </label>}
            <ul className="selectedAttractions" id="ClickAbleAttractions">
                {this.state.selectedAttractions.length > 0 ? this.state.selectedAttractions.map((attraction, index) => {
                    return <li key={attraction.title + index}
                               className="singleRoute"
                               onClick={() => {
                                   let selectedAttractions = this.state.selectedAttractions;
                                   delete selectedAttractions[index];
                                   let attractions = [...this.state.attractions, attraction];
                                   selectedAttractions = selectedAttractions.filter(function (n) {
                                       return n !== undefined;
                                   });
                                   this.setState({
                                       selectedAttractions,
                                       attractions
                                   }, () => this.props.onChange && this.props.onChange(selectedAttractions));
                               }}
                               title="Add attraction to route">
                        {index === 0 && <p className="alert alert-primary">This will be the start of the tour</p>}
                        <figure className="singleRoute__imageAndDescription">
                            <img className="img-thumbnail" src={attraction.images[0].original}
                                 alt={attraction.title}/>
                            <figcaption className={"singleRoute__imageAndDescription__description"}>
                                <h3 className="title">
                                    {attraction.title}
                                </h3>
                            </figcaption>
                            <div className="pin"><span>{alphabet[index].toUpperCase()}</span></div>
                        </figure>
                        {index !== 0 && index === this.state.selectedAttractions.length - 1 &&
                        <p className="alert alert-primary">This will be the end of the tour</p>}
                    </li>;
                }) : <p>Please choose attractions for your new route!</p>}
            </ul>
            <hr/>
        </div>;

    }
}

