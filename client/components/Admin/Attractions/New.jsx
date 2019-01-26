import Moment from "moment";
import {find, propEq} from "ramda";
import TimePicker from "rc-time-picker";
import React from "react";
import {compose, graphql} from "react-apollo";
import Dropzone from "react-dropzone";
import {AddAttractionMutation} from "../../../graphql/mutations/attraction/attractionMutations";
import {Attraction, AttractionsQueryLimited} from "../../../graphql/queries/attraction/attractionQueries";
import {timeFromUnix, timeToUnix} from "../../../helpers";
import LoadingIcon from "../../Common/LoadingIcon";
import FormMap from "../../Map/FormMap";

const defaultState = {
    title: "",
    description: "",
    shortDescription: "",
    images: [],
    audioFiles: [],
    lat: null,
    lng: null,
    duration: new Moment(0),
    error: [],
    uploadLoading: false
};


class NewUser extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = defaultState;
        if (document) {
            this.ReactQuill = require("react-quill");
        }
    }


    onDrop(files) {
        let {audioFiles, images, error} = this.state;
        files.map(file => {
            if (file && file.size < 10000000) {
                if (file.type === "audio/mp3" && !find(propEq("name", file.name || file), audioFiles)) {
                    audioFiles = [...audioFiles, file];
                } else if (file.type === "image/jpeg" && !find(propEq("name", file.name || file.original), images)) {
                    images = [...images, file];
                } else {
                    error = [...error, "Not allowed filetype!"];
                }
            } else {
                error = [...error, "To big filesize"];
            }
            this.setState({
                images,
                audioFiles,
                error
            });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let {title, description, audioFiles, images, lat, lng, duration, shortDescription} = this.state;

        this.setState({
            uploadLoading: true
        });

        duration = this.state.duration <= 0 ? 0 : timeToUnix(this.state.duration);

        images = images.filter(function (n) {
            return n !== undefined;
        });

        audioFiles = audioFiles.filter(function (n) {
            return n !== undefined;
        });


        this.props.AddAttractionMutation({
            variables: {
                input: {
                    title, description, audioFiles, images, lat, lng, duration, shortDescription
                },
            },
            update: (store, res) => {
                try {
                    let newAttraction = res.data.addAttraction;
                    let storeData = store.readQuery({query: AttractionsQueryLimited});
                    storeData.Attractions = [...storeData.Attractions, newAttraction];
                    store.writeQuery({query: AttractionsQueryLimited, data: storeData});
                } catch (err) {
                }

            }
        }).then((attraction) => {

            if (attraction) {
                this.setState(defaultState, () => {
                    this.props.history.push({
                        pathname: "/Admin/Attractions",
                        state: {
                            msg: {
                                icon: "success",
                                msg: ["Successfully created"]
                            }
                        }
                    });
                });
            }
        });
    }

    render() {

        const {title, description, images, audioFiles, lat, lng, shortDescription} = this.state;

        const ReactQuill = this.ReactQuill;

        const disabled = title === "" || description === "" || images === [] || audioFiles === [] || lat === null || lng === null || shortDescription === "";

        return <section id={"NewAttraction"} className={"contentContainer"}>
            <h2 className={"description"}>
                New Attraction
            </h2>
            <form action="" onSubmit={this.handleSubmit} className="newAttractionForm">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control titleInput"
                       onChange={(newValue) => {
                           this.setState({
                               title: newValue.target.value
                           });
                       }}
                       id="title"
                       value={title}
                       placeholder="Just enter the attraction-title!"
                />
                <hr/>

                <label htmlFor="duration">Duration</label> (in hours)

                <TimePicker value={this.state.duration}
                            onChange={(newValue) => {
                                this.setState({
                                    duration: newValue
                                });
                            }}
                            showSecond={false}
                            minuteStep={15}
                            defaultValue={timeFromUnix(54000)}/>

                <hr/>
                <label htmlFor="descr">Description</label>
                {ReactQuill ? <ReactQuill id="descr"
                                          placeholder="Just paste you HTML code here or start typing your description!"
                                          className="descriptionInput"
                                          onChange={(description) => {
                                              this.setState({
                                                  description
                                              });
                                          }}
                                          value={description}
                /> : null
                }
                <hr/>
                <label htmlFor="shortDescr">Short Description</label>
                <textarea className="form-control"
                          id="shortDescr"
                          rows={6}
                          placeholder="This will be used as short description and Meta-Description"
                          onChange={(item) => {
                              this.setState({
                                  shortDescription: item.target.value
                              });
                          }}>
                    </textarea>


                <hr/>
                <label htmlFor="position">Position</label>
                <FormMap id="position"
                         handleChange={(position) => {
                             this.setState({
                                 lng: position.lng,
                                 lat: position.lat
                             });
                         }}/>
                <hr/>
                <label htmlFor="files">Files</label>
                <div className="dropzone fileInput">
                    <Dropzone onDrop={this.onDrop.bind(this)} id="files">
                        <p>Just drag your audio-files(.mp3) and images (.jpg) here </p>
                    </Dropzone>
                </div>

                {this.state.audioFiles.length > 0 && (<div className="preview">
                    <h3>Uploaded Audio Files</h3>
                    <ul>
                        {
                            !this.state.uploadLoading && this.state.audioFiles.length > 0 && this.state.audioFiles.map((f, key) =>
                                <li key={f ? f.name : "e" + key.toString()}>
                                    <audio controls id="testTone" preload="metadata">
                                        <source src={f.preview} type="audio/mp3"/>
                                    </audio>

                                    <button onClick={() => {
                                        let newFiles = this.state.audioFiles;
                                        delete newFiles[key];
                                        this.setState({
                                            audioFiles: newFiles
                                        });
                                    }} className="btn btn-danger">
                                        Delete Audio File
                                    </button>
                                </li>)
                        }
                    </ul>
                </div>)}

                {this.state.images.length > 0 && (<div className="preview">
                    <h3>Uploaded Images</h3>
                    <ul>
                        {
                            !this.state.uploadLoading && this.state.images.length > 0 && this.state.images.map((f, key) =>
                                <li
                                    key={f ? f.name : "" + key.toString()}>
                                    <img src={f ? f.preview : key.toString()} alt={Attraction.title}/>
                                    <button onClick={() => {
                                        let newImages = this.state.images;
                                        delete newImages[key];
                                        this.setState({
                                            images: newImages
                                        });
                                    }} className="btn btn-danger">
                                        Delete Image
                                    </button>
                                </li>)
                        }
                    </ul>
                </div>)}

                <hr/>
                <div className="submitButton">
                    <button type="submit"
                            disabled={disabled}
                            className="btn btn-primary">
                        {this.state.uploadLoading ? <LoadingIcon text={"Uploading..."}/> : "Create Attraction "}

                    </button>
                </div>

            </form>


        </section>;
    }
}

export default compose(
    graphql(AddAttractionMutation, {
        name: "AddAttractionMutation",
    }),
)(NewUser);

