import React from "react";
import {Link} from "react-router-dom";


export class AttractionList extends React.Component {

    constructor(props) {
        super(props);
        this.passDataToParent = this.passDataToParent.bind(this);
        this.state = {};
    }

    passDataToParent(id) {
        this.props.handleAttractionClick && this.props.handleAttractionClick(id);
    }

    render() {
        return <ol id={"AttractionList"}>
            {
                this.props.attractions.map((attraction, index) => {
                    return <li key={attraction.title + index} className="attractionListItem">
                        {this.props.insideApp ?
                            <div className="attractionListItem__container" onClick={() => {
                                this.passDataToParent(attraction._id);
                            }}>
                                <img src={attraction.images[0].original} alt="" className="img-thumbnail"/>
                                <h3 className="title">
                                    {attraction.title}
                                </h3>
                            </div> :
                            <Link to={"/Attraction/" + attraction._id} className="attractionListItem__container">
                                <img src={attraction.images[0].original} alt="" className="img-thumbnail"/>
                                <h3 className="title">
                                    {attraction.title}
                                </h3>
                            </Link>}
                        {this.props.attractions.length - 1 !== index && (<hr/>)}

                    </li>;
                })
            }
        </ol>;

    }
}

