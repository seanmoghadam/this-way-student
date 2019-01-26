import React from "react";
import {Link} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {resetScrollPosition} from "../../helpers";
import Attractions from "../Attractions/Attractions";
import Routes from "../Routes/Routes";


export default class RoutesAndAttractions extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.state = {
            tab: this.props.history.location.pathname.includes("/Attractions") ? 1 : 0
        };
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
        if (tab === 1) this.props.history.push({
            pathname: "/Attractions",
        });
        else this.props.history.push({
            pathname: "/Routes",
        });
    }

    componentDidMount() {
        resetScrollPosition();
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            tab: nextProps.history.location.pathname.includes("/Attractions") ? 1 : 0
        };
    }

    render() {

        return <section id={"RoutesAndAttractions"}>
            <Tabs selectedIndex={this.state.tab}
                  onSelect={tab => {
                      this.setState({tab});
                  }}>
                <TabList>
                    <Tab>
                        <Link to={"/Routes"}><h2>Routes</h2></Link>
                    </Tab>
                    <Tab>
                        <Link to={"/Attractions"}><h2>Attractions</h2></Link>
                    </Tab>
                </TabList>
                <TabPanel>
                    <Routes location={this.props.location}/>
                </TabPanel>
                <TabPanel>
                    <Attractions location={this.props.location}/>
                </TabPanel>
            </Tabs>
        </section>;
    }

}



