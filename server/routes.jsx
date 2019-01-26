import React from "react";
import {Route, Switch} from "react-router-dom";
import AttractionDetails from "../client/components/Attractions/AttractionDetails";
import About from "../client/components/Common/About";
import RoutesAndAttractions from "../client/components/Common/RoutesAndAttractions";
import Terms from "../client/components/Common/Terms";
import RouteDetails from "../client/components/Routes/RouteDetails";

//server routes - these are available without js

// Components
export default <Switch>
    <Route path="/Route/:routeId/" render={(routerProps) => <RouteDetails {...routerProps} />}/>
    <Route path="/Routes" render={(routerProps) => <RoutesAndAttractions {...routerProps} />}/>
    <Route path="/Attraction/:attractionId/" render={(routerProps) => <AttractionDetails {...routerProps} />}/>
    <Route path="/Attractions" render={(routerProps) => <RoutesAndAttractions {...routerProps} />}/>
    <Route path="/Terms/" render={(routerProps) => <Terms {...routerProps}/>}/>
    <Route path="/About/" render={(routerProps) => <About{...routerProps}/>}/>
</Switch>;