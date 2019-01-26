import React from "react";

export class BurgerIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            overlay: this.props.overlay
        };

    }

    static getDerivedStateFromProps(nextProps) {
        return {
            overlay: nextProps.overlay
        };
    }

    render() {
        const {overlay} = this.state;
        let toggleBurgerClass = overlay ? " is-open" : " is-closed";

        return <div className={"burgerIcon" + toggleBurgerClass}>
            <div className="line-top"></div>
            <div className="line-middle"></div>
            <div className="line-bottom"></div>
        </div>;
    }

}

