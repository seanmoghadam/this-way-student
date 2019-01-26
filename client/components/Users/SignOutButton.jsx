import React from "react";


export default class SignOutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return <button
            type="button"
            className={"btn btn-danger overlay__navList__item__aTag logoutButton"}
            onClick={() => {
                if (localStorage !== undefined) {
                    localStorage.clear();
                    localStorage.setItem("acceptedCookies", "true");
                }
                this.props.client && this.props.client.resetStore();
                this.props.hideOverlay && this.props.hideOverlay();
                this.props.history.push({
                    pathname: "/",
                    state: {
                        msg: {
                            icon: "success",
                            msg: ["Successfully logged out", "See you next time!"]
                        }
                    }
                });
            }}
        >
            SIGN OUT

            <svg version="1.1" viewBox="0 0 512 512" xmlSpace="preserve"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m70.8 276.7h274.2c11.4 0 20.8-9.3 20.8-20.7s-9.3-20.8-20.8-20.8h-274.1l40-40c8.1-8.1 8.1-21.2 0-29.4-3.9-3.9-9.1-6-14.7-6s-10.7 2.2-14.7 6.1l-75.3 75.3c-2 1.9-3.5 4.2-4.7 7-1 2.5-1.5 5.2-1.5 7.8 0 2.7 0.5 5.3 1.6 7.9s2.6 4.9 4.5 6.7l75.4 75.4c3.9 3.9 9.1 6.1 14.7 6.1 5.5 0 10.7-2.2 14.7-6.1 8-8.1 8-21.2 0-29.3l-40.1-40z"/>
                <path
                    d="m442.9 70.2h-233.3c-38.1 0-69.1 31-69.1 69.1v61.4c0.3 11.2 9.5 20.2 20.7 20.3 17.7 0.1 20.8-12.7 20.7-18.3v-63.4c0-15.2 12.4-27.6 27.6-27.6h233.3c15.2 0 27.6 12.4 27.6 27.6v233.3c0 15.2-12.4 27.6-27.6 27.6h-233.2c-15.2 0-27.6-12.4-27.6-27.6v-62.1c-0.3-18.8-13.8-19.7-20.7-19.7-11.3 0-20.4 8.9-20.7 20.8v61c0 38.1 31 69.1 69.1 69.1h233.3c38.1 0 69.1-31 69.1-69.1v-233.2c-0.1-38.2-31.1-69.2-69.2-69.2z"/>
            </svg>

        </button>;

    }
}

