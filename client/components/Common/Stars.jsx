//inspired by codepen example and adapted to react component with different styling
// https://codepen.io/marcobiedermann/pen/WbGazL

import React from "react";

const FullStarIcon = <svg className="fullStarIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
</svg>;

const EmptyStarIcon = <svg className="emptyStarIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                           viewBox="0 0 24 24">
        <path
            d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
    </svg>
;


export default class Stars extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: this.props.editing || false,
            rating: this.props.rating !== undefined ? this.props.rating : -1,
            rate: 0
        };
    }

    render() {
        const {editing, rating} = this.state;
        return <div id="Stars">
            {!editing ? [0, 1, 2, 3, 4].map((rate, index) => {
                return rating >= index ? <div key={index}>
                    <div key={index}>{FullStarIcon}</div>
                </div> : <div key={index}>
                    {EmptyStarIcon}
                </div>;
            }) : [0, 1, 2, 3, 4].map((rate, index) => {
                return rating >= index ?
                    <div className="editing" onClick={() => {
                        this.setState({rating: index});
                        this.props.onChange && this.props.onChange(index);
                    }} key={index}>{FullStarIcon}</div>
                    :
                    <div className="editing" onClick={() => {
                        this.setState({rating: index});
                        this.props.onChange && this.props.onChange(index);
                    }} key={index}>{EmptyStarIcon}</div>;
            })}


        </div>;
    }


}
