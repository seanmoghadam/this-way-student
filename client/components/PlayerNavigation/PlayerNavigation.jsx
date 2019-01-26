import React from "react";
import Draggable from "react-draggable";
import ReactHowler from "react-howler";
import ReactInterval from "react-interval";
import {ProgressBar, TimeMarker} from "react-player-controls";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {AttractionList} from "../Attractions/AttractionList";


export default class PlayerNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.fullyOpenedPosition = {x: 0, y: window.innerHeight * -0.7};
        this.openedPosition = {x: 0, y: -150};
        this.closedPosition = {x: 0, y: -50};
        this.state = {
            position: this.closedPosition,
            dragging: false,
            playList: this.props.playList || [],
            isPlaying: false,
            currentFile: 0,
            currentTime: 0,
            attractions: this.props.attractions || [],
            tab: 0,
            audioLoaded: false,
        };
        this.open = this.open.bind(this);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.openFully = this.openFully.bind(this);
        this.close = this.close.bind(this);
        this.setToPlaying = this.setToPlaying.bind(this);
        this.setToStopped = this.setToStopped.bind(this);
        this.passDataToParent = this.passDataToParent.bind(this);
        this.calculateSlidePosition = this.calculateSlidePosition.bind(this);
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }

    setToPlaying(index) {
        const newIndex = typeof index !== "number" ? this.state.currentFile : index;
        this.setState({
            isPlaying: true,
            currentTime: this.player ? this.player.seek() : this.state.currentTime,
            currentFile: newIndex
        });
    }

    calculateSlidePosition(position) {
        if (position >= window.innerHeight * 0.35 + 1) {
            return this.fullyOpenedPosition.y;
        } else if (position <= window.innerHeight * 0.35 && position >= 80) {
            return this.openedPosition.y;
        } else if (position < 80) {
            return this.closedPosition.y;
        }

    }

    setToStopped(endOfFile, paused, index) {
        const {currentFile, playList, currentTime} = this.state;
        const nextSongIsAvailable = playList[currentFile + 1];
        const nextFile = currentFile + 1;
        const firstFile = 0;
        this.setState({
            isPlaying: false,
            y: 150,
            currentTime: paused ? currentTime : 0,
            currentFile: index || (endOfFile && nextSongIsAvailable ? nextFile : (paused ? currentFile : firstFile))
        });
    }

    open() {
        this.setState({
            position: this.openedPosition
        });
    }

    openFully() {
        this.setState({
            position: this.fullyOpenedPosition
        });
    }


    close() {
        this.setState({
            position: this.closedPosition
        });
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.currentFile && !prevState.isPlaying && nextProps.playList && nextProps.playList[nextProps.currentFile]) {
            const newIndex = typeof nextProps.currentFile !== "number" ? this.state.currentFile : nextProps.currentFile;
            return {
                playList: nextProps.playList,
                attractions: nextProps.attractions,
                isPlaying: true,
                currentTime: this.player ? this.player.seek() : this.state.currentTime,
                currentFile: newIndex
            };
        }
        return null;
    }


    static isClosed(position) {
        return position.y === -50;
    }

    static isFullyOpened(position) {
        return position.y === window.innerHeight * -0.7;
    }

    static isOpened(position) {
        return position.y === -150;
    }

    passDataToParent(id) {
        this.props.handleAttractionClick && this.props.handleAttractionClick(id);
    }


    render() {
        const {position, playList, isPlaying, currentTime, currentFile, attractions, audioLoaded} = this.state;
        return (
            <div id={"PlayerNavigation"} onClick={(event) => event.stopPropagation()}>

                <Draggable
                    axis="y"
                    defaultClassName={""}
                    defaultClassNameDragging={"noTransition"}
                    defaultClassNameDragged={"PlayerNavigationAnimation"}
                    handle=".dragComponent__handle"
                    defaultPosition={position}
                    bounds={{left: 0, top: window.innerHeight * -0.7, right: 0, bottom: 0}}
                    position={position}
                    onDrag={(newPosition) => {
                        this.setState({
                            position: {
                                y: this.calculateSlidePosition(window.innerHeight - (newPosition.clientY || newPosition.changedTouches[0].clientY)),
                                x: 0
                            }
                        });
                    }}
                    onStop={(newPosition) => {
                        this.setState({
                            position: {
                                y: this.calculateSlidePosition(window.innerHeight - (newPosition.clientY || newPosition.changedTouches[0].clientY)),
                                x: 0
                            }
                        });
                    }}>
                    <div className={"dragComponent"}>
                        <div className="dragComponent__handle" onClick={() => {
                            PlayerNavigation.isClosed(position) ? this.open() : this.close();
                        }}>
                            <svg className="dragComponent__handle__icon" xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" viewBox="0 0 24 24">
                                <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                            </svg>
                        </div>
                        <div className={"libContainer"}>{isPlaying && this.player &&
                        <ReactInterval {...{timeout: 500, enabled: true}}
                                       callback={() => this.setState({currentTime: this.player.seek()})}/>}
                            <ReactHowler
                                src={playList[currentFile].audioFile}
                                playing={isPlaying}
                                volume={1.0}
                                onLoad={() => this.setState({audioLoaded: true})}
                                html5={true}
                                ref={(ref) => (this.player = ref)}
                                onEnd={() => this.setToStopped(true, false)}/></div>

                        <div className="dragComponent__player">
                            <div className="dragComponent__player__upper">

                                <button className={"PrevButton"} onClick={() => {
                                    this.setState({isPlaying: true, currentFile: currentFile - 1});
                                }} disabled={typeof playList[currentFile - 1] === "undefined" || !audioLoaded}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24"
                                         className="Icon PreviousIcon">
                                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                                    </svg>
                                </button>

                                <button className={"PlayButton"} disabled={!audioLoaded}
                                        onClick={() => !isPlaying ? this.setToPlaying() : this.setToStopped(false, true)}>{
                                    isPlaying ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24"
                                             className="Icon PreviousIcon">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" className="Icon-shape"/>
                                        </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                               viewBox="0 0 24 24"
                                               className="Icon PreviousIcon">
                                            <path d="M8 5v14l11-7z" className="Icon-shape"/>
                                        </svg>
                                }</button>

                                <button className={"NextButton"} onClick={() => {
                                    this.setState({isPlaying: true, currentFile: currentFile + 1});
                                }} disabled={typeof playList[currentFile + 1] === "undefined" || !audioLoaded}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         className="Icon PreviousIcon">
                                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" className="Icon-shape"/>
                                    </svg>
                                </button>
                                <button className={"PlayListButton NextButton"}
                                        onClick={() => !PlayerNavigation.isFullyOpened(position) ? this.openFully() : this.open()
                                        } disabled={!playList || !audioLoaded}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         className="Icon PreviousIcon">
                                        <path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h13v-2H2v2zm15-2v6l5-3-5-3z"
                                              className="Icon-shape"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="dragComponent__player__lower">
                                <TimeMarker
                                    totalTime={this.player && this.player.duration() || 0}
                                    markerSeparator={playList || audioLoaded ? playList[currentFile].title : "Loading"}
                                    currentTime={typeof currentTime === "number" ? currentTime : 0}/>


                                <ProgressBar
                                    totalTime={this.player ? this.player.duration() : 0}
                                    currentTime={typeof currentTime === "number" ? currentTime : 0}
                                    bufferingTime={0}
                                    isSeekable={true}
                                    onSeek={seekTime => {
                                        this.player && this.player.seek();
                                        typeof currentTime === "number" && this.setState({currentTime: seekTime});
                                    }}
                                    onSeekStart={(seekTime) => {
                                        this.player && this.player.seek();
                                        typeof currentTime === "number" && this.setState({currentTime: seekTime});
                                        this.player && this.setToStopped(false, true);
                                    }}
                                    onSeekEnd={seekTime => {
                                        this.player && this.player.seek(seekTime);
                                        this.player && this.setToPlaying();
                                    }}
                                    onIntent={seekTime => typeof currentTime === "number" && this.setState({currentTime: seekTime})}
                                />
                            </div>

                        </div>
                        <div className="dragComponent__infoArea"
                             style={{height: (window.innerHeight * 0.7 - 149).toString() + "px"}}>
                            <Tabs selectedIndex={this.state.tab}
                                  onSelect={tab => {
                                      this.setState({tab});
                                  }}>
                                <TabList>
                                    <Tab onClick={() => {
                                        this.handleUrlAndState(0);
                                    }}>
                                        <h2>Playlist</h2>
                                    </Tab>
                                    <Tab onClick={() => {
                                        this.handleUrlAndState(1);
                                    }}>
                                        <h2>Attractions</h2>
                                    </Tab>
                                </TabList>
                                <TabPanel>
                                    <ol className="playList">
                                        {playList.map((file, index) => <li
                                                className={"playList__item" + (index === currentFile ? " activeFile" : "")}
                                                key={file.audioFile + index}>
                                                <p className="title">{index + 1}. {file.title}</p>
                                                <div className="playList__item__buttonContainer">
                                                    <button className="playAndPause"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                if (isPlaying) {
                                                                    if (index === currentFile) {
                                                                        this.setToStopped(true, false, index);
                                                                    } else {
                                                                        this.setToPlaying(index);
                                                                    }
                                                                } else {
                                                                    this.setToPlaying(index);
                                                                }
                                                            }}>
                                                        {isPlaying && index === currentFile ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                 viewBox="0 0 24 24">
                                                                <path
                                                                    d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"/>
                                                            </svg>
                                                            : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                   viewBox="0 0 24 24">
                                                                <path
                                                                    d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                                            </svg>
                                                        }
                                                    </button>
                                                    {/* <button className="menu">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                                        </svg>
                                                    </button>*/}
                                                </div>

                                            </li>
                                        )}
                                    </ol>


                                </TabPanel>
                                <TabPanel>
                                    <AttractionList insideApp={true} attractions={attractions}
                                                    handleAttractionClick={(id) => {
                                                        this.passDataToParent(id);
                                                        this.close();
                                                    }}/>
                                </TabPanel>
                            </Tabs>

                        </div>
                    </div>
                </Draggable>
            </div>

        );
    }
}
