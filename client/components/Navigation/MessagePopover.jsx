import React from "react";


export const successSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
</svg>;

export const failureSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
</svg>;

export class MessagePopover extends React.Component {

    constructor(props) {
        super(props);
        this.messageShouldMount = this.messageShouldMount.bind(this);
        this.state = {
            message: this.props.message,
            showMessage: true
        };
    }


    static getIconContainer(iconClassName, SVG) {
        return <div className={iconClassName + " icon"}>
            {SVG}
        </div>;
    }

    static getMessageIcon(msgObject) {
        let SVG;
        if (msgObject) {
            switch (msgObject.icon) {

                case "success" : {
                    SVG = successSVG;
                    return MessagePopover.getIconContainer("successIcon", SVG);
                }
                case "failure" : {
                    SVG = failureSVG;
                    return MessagePopover.getIconContainer("failureIcon", SVG);
                }
                case "info" : {
                    SVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                    </svg>;
                    return MessagePopover.getIconContainer("infoIcon", SVG);
                }

            }
        } else {
            return "";
        }

    }

    static getMessageAndContainer(msgObject) {
        if (msgObject && msgObject.msg.length !== 0) return <div className={"messageText"}>{
            msgObject.msg.map((msg, index) => <p key={msg + index}>{msg}</p>)
        }</div>;
        else return "";
    }

    messageShouldMount() {
        setTimeout(() => {
            this.setState({showMessage: false});
            this.props.history && this.props.history.replace(this.props.history.location.pathname, {});
        }, 2650);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.message !== prevState.message) return {
            message: nextProps.message,
            showMessage: true
        };
        else return null;
    }


    render() {
        return this.state.message && this.state.showMessage ? (<div id="MessagePopover" style={this.props.style}>
            {this.messageShouldMount()}
            {MessagePopover.getMessageIcon(this.props.message)}
            {MessagePopover.getMessageAndContainer(this.props.message)}
        </div>) : "";


    }

}




