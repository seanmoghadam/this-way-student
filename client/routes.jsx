import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Dashboard from "./components/Admin/Admin_Dashboard";
import Admin_Attractions from "./components/Admin/Attractions/Admin_Attractions";
import Admin_EditAttraction from "./components/Admin/Attractions/Edit";
import Admin_NewAttraction from "./components/Admin/Attractions/New";
import Admin_Routes from "./components/Admin/Routes/Admin_Routes";
import Admin_EditRoute from "./components/Admin/Routes/Edit";
import Admin_NewRoute from "./components/Admin/Routes/New";
import Admin_UserEdit from "./components/Admin/User/Admin_Edit";
import Admin_Users from "./components/Admin/User/Admin_Users";
import AttractionDetails from "./components/Attractions/AttractionDetails";
import About from "./components/Common/About";
import Error from "./components/Common/Error";
import RoutesAndAttractions from "./components/Common/RoutesAndAttractions";
import Terms from "./components/Common/Terms";
import Guide from "./components/Guide/Guide";
import RouteDetails from "./components/Routes/RouteDetails";
import UserEdit from "./components/Users/Edit";
import LoginForm from "./components/Users/LoginForm";
import SignUpForm from "./components/Users/SignUpForm";
import User from "./components/Users/User";
import {loggedIn, loggedInAndAdmin} from "./helpers";


//these are the client routes


// Components


const UnregisteredRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        !loggedIn() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: "/",
                state: {
                    from: props.location,
                    msg: {
                        icon: "info",
                        msg: ["Already logged in!"]
                    }
                }
            }}/>
        )
    )}/>
);

const RegisteredRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        loggedIn() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: "/",
                state: {
                    from: props.location,
                    msg: {
                        icon: "failure",
                        msg: ["Not authorized!"]
                    }
                }
            }}/>
        )
    )}/>
);

const AdminRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        loggedInAndAdmin() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: "/",
                state: {
                    from: props.location,
                    msg: {
                        icon: "failure",
                        msg: ["Not authorized!"]
                    }
                },

            }}/>
        )
    )}/>
);


export default <Switch>

    {/*Common Pages*/}
    <Route path="/Route/:routeId/" render={(routerProps) => <RouteDetails {...routerProps} />}/>
    <Route path="/Routes" render={(routerProps) => <RoutesAndAttractions {...routerProps} />}/>
    <Route path="/Attraction/:attractionId/" render={(routerProps) => <AttractionDetails {...routerProps} />}/>
    <Route path="/Attractions" render={(routerProps) => <RoutesAndAttractions {...routerProps} />}/>
    <Route path="/Terms/" render={(routerProps) => <Terms {...routerProps}/>}/>
    <Route path="/About/" render={(routerProps) => <About{...routerProps}/>}/>
    <Route path="/Terms/" render={(routerProps) => <Terms {...routerProps}/>}/>


    {/*{"only available if not registered or logged in"}*/}
    <UnregisteredRoute path="/Login/" component={LoginForm}/>
    <UnregisteredRoute path="/SignUp/" component={SignUpForm}/>

    {/*{"Only if logged in"}*/}
    <RegisteredRoute path="/User/Edit" component={UserEdit}/>
    <RegisteredRoute path="/User/" component={User}/>
    <RegisteredRoute path="/Guide/:routeId" component={Guide}/>

    {/*Admin Pages*/}
    <AdminRoute path="/Admin/User/Edit/:userId" component={Admin_UserEdit}/>
    <AdminRoute path="/Admin/Users/" component={Admin_Users}/>
    <AdminRoute path="/Admin/Attraction/New" component={Admin_NewAttraction}/>
    <AdminRoute path="/Admin/Attraction/Edit/:attractionId" component={Admin_EditAttraction}/>
    <AdminRoute path="/Admin/Attractions/" component={Admin_Attractions}/>
    <AdminRoute path="/Admin/Route/New" component={Admin_NewRoute}/>
    <AdminRoute path="/Admin/Route/Edit/:routeId" component={Admin_EditRoute}/>
    <AdminRoute path="/Admin/Routes/" component={Admin_Routes}/>
    <AdminRoute path="/Admin/" component={Dashboard}/>


    {/*Error*/}
    <Route render={() => <Error/>}/>

</Switch>;
