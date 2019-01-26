import jwt from "jsonwebtoken";
import Moment from "moment";
import {pick} from "ramda";
import React from "react";
import {AppHelmet} from "./components/App";

export function formatTitle(title) {
    title = removeFirstChar(title);
    return ucfirst(title);
}

export function beautifyFileName(fileName) {
    fileName = fileName.replace("https://this-way.s3.amazonaws.com", "");
    fileName = fileName.slice(fileName.indexOf("-") + 1, fileName.indexOf("."));
    return ucfirst(fileName);
}

export function setHeaders(description, customTitle, location) {
    return <AppHelmet>
        <title>{location.pathname === "/" ? "ThisWay -" +
            " Guided walks through Vienna" : "ThisWay - " + (customTitle || formatTitle(location.pathname))}</title>
        <meta name="description" content={description}/>
    </AppHelmet>;
}

export function removeFirstChar(string) {
    return string.substring(1);
}

export function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function timeToUnix(time) {
    return (Moment.utc(time).unix()) * 1000;
}

export function timeFromUnix(unixTime) {
    return new Moment(unixTime).utc();
}

export function getWayPoints(attractions, offset) {

    return attractions.map((wayPoint, index) => {

        let wayPointsObj = pick(["lat", "lng"], wayPoint);
        return [wayPointsObj.lat, wayPointsObj.lng];


    });
}

export function checkExpiry(token) {
    const decodedToken = jwt.decode(token);
    return Date.now() > decodedToken.exp;
}

export function displayTotalDuration(totalDuration) {
    return Moment(totalDuration).utc().startOf("hour").add(1, "hour").format("HH:mm");
}

export function displayTotalDistance(totalDistance) {
    return "~ " + Math.round((totalDistance / 1000) * 100) / 100 + " km";
}

export function getRouteImages(attractions) {
    return attractions.map(attraction => attraction.images[0]);
}

export function checkIfIsAdmin(token) {
    const decodedToken = jwt.decode(token);
    return decodedToken.admin;
}

export function resetScrollPosition() {
    if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
    }
}

export function loggedIn() {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && checkExpiry(token)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function loggedInAndAdmin() {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && checkExpiry(token) && checkIfIsAdmin(token)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function getEmailFromToken() {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token");
        const decodedToken = jwt.decode(token);
        return decodedToken.email || "";
    } else {
        return null;
    }
}

export function getIdFromToken() {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token");
        const decodedToken = jwt.decode(token);
        return decodedToken.id || "";
    } else {
        return null;
    }
}


export function formatParamsId(params) {
    return {
        _id: {
            $oid: params.id
        }

    };
}

export function logoutAndClear(history, page) {
    history.push({
        pathname: page ? page : "/Login",
        state: {
            msg: {
                icon: "alert",
                msg: ["Something happened", "Please login again!"]
            }
        }
    });
    if (typeof localStorage !== "undefined") {
        localStorage.clear();
        localStorage.setItem("acceptedCookies", "true");
    }
}

export function formatMongoTime(time) {
    let splittedTime = time.split(":");
    return splittedTime[0] + ":00";

}


export const randomString = function (length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};