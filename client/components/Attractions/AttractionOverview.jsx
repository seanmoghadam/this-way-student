import React from "react";
import ImageGallery from "react-image-gallery";
import {Link} from "react-router-dom";

export class AttractionOverview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }


    render() {
        return <ul id={"AttractionOverview"}>
            {
                this.props.attractions.map((attraction, index) => {
                    return <li key={attraction.title + index} className="singleAttraction">
                        <figure className="singleAttraction__imageAndDescription">
                            <ImageGallery items={attraction.images}
                                          showBullets={true}
                                          showThumbnails={false}
                                          showFullscreenButton={true}
                                          className="singleAttraction__imageAndDescription__img"
                            />
                            <figcaption className={"singleAttraction__imageAndDescription__description"}>
                                <h3 className="title">
                                    {attraction.title}
                                </h3>
                                <article>
                                    {attraction.shortDescription}
                                </article>
                            </figcaption>
                        </figure>
                        <div className="singleAttraction__buttonArea">
                            <Link to={"/Attraction/" + attraction._id} className="btn btn-primary detailsButton">
                                More Details
                            </Link>

                        </div>
                    </li>;
                })
            }
        </ul>;

    }
}

