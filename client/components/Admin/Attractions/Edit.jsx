import {find, propEq, update} from "ramda";
import TimePicker from "rc-time-picker";
import React from "react";
import {compose, graphql} from "react-apollo";
import Dropzone from "react-dropzone";
import {UpdateAttractionMutation} from "../../../graphql/mutations/attraction/attractionMutations";
import {Attraction, AttractionsQueryLimited} from "../../../graphql/queries/attraction/attractionQueries";
import {timeFromUnix, timeToUnix} from "../../../helpers";
import Loading from "../../Common/Loading";
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
    duration: timeFromUnix(0),
    error: [],
    uploadLoading: false,
    uploadedImages: [],
    uploadedAudioFiles: []
};


class EditAttraction extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = defaultState;
        if (document) {
            this.ReactQuill = require("react-quill");
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps && !nextProps.Attraction.loading && nextProps.Attraction.SingleAttraction.title !== prevState.title) {
            const {title, images, description, audioFiles, lat, lng, duration, shortDescription} = nextProps.Attraction.SingleAttraction;
            return {
                title,
                shortDescription,
                images,
                description,
                audioFiles,
                lat,
                lng,
                duration: timeFromUnix(duration),
                id: nextProps.match.params.attractionId
            };
        }
        else return null;
    }


    onDrop(files) {
        let {uploadedAudioFiles, uploadedImages, error} = this.state;


        files.map(file => {
            if (file && file.size < 10000000) {
                if (file.type === "audio/mp3" && !find(propEq("name", file.name || file), uploadedAudioFiles)) {

                    uploadedAudioFiles = [...uploadedAudioFiles, file];
                } else if (file.type === "image/jpeg" && !find(propEq("name", file.name || file.original), uploadedImages)) {
                    uploadedImages = [...uploadedImages, file];
                } else {
                    error = [...error, "Not allowed filetype!"];
                }
            } else {
                error = [...error, "To big Filesize"];
            }
            this.setState({
                uploadedImages,
                uploadedAudioFiles,
                error
            });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let {title, description, audioFiles, uploadedAudioFiles, uploadedImages, images, lat, lng, duration, id, shortDescription} = this.state;
        this.setState({
            uploadLoading: true
        });

        audioFiles = [...audioFiles, ...uploadedAudioFiles];
        images = [...images, ...uploadedImages];

        duration = this.state.duration <= 0 ? 0 : timeToUnix(this.state.duration);

        images = images.filter(function (n) {
            return n !== undefined;
        });

        audioFiles = audioFiles.filter(function (n) {
            return n !== undefined;
        });


        this.props.UpdateAttractionMutation({
            variables: {
                input: {
                    title, description, audioFiles, images, lat, lng, duration, id, shortDescription
                },
            },
            update: (store, res) => {
                try {
                    let updatedAttraction = res.data.updateAttraction;
                    let storeData = store.readQuery({query: AttractionsQueryLimited});
                    storeData = update(propEq("_id", updatedAttraction._id)(storeData.Attractions), updatedAttraction, storeData.Attractions);
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
                                msg: ["Successfully updated"]
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

        if (!this.props.Attraction.loading) {
            return <section id={"NewAttraction"} className={"contentContainer"}>
                <h2 className={"description"}>
                    Edit Attraction
                </h2>
                <form action="" onSubmit={this.handleSubmit} className="newAttractionForm">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control titleInput" onChange={(newValue) => {
                        this.setState({
                            title: newValue.target.value
                        });
                    }} id="title" value={title} placeholder="Just enter the attraction-title!"/>


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
                              rows={6}
                              id="shortDescr"
                              placeholder="This will be used as short description and Meta-Description"
                              onChange={(item) => {
                                  this.setState({
                                      shortDescription: item.target.value
                                  });
                              }} defaultValue={shortDescription}>

                    </textarea>

                    <hr/>
                    <label htmlFor="position">Position</label>
                    <FormMap id="position"
                             lat={lat}
                             lng={lng}
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

                    {this.state.uploadedAudioFiles.length > 0 && (<div className="preview">
                        <hr/>
                        <h3>Uploaded Audio Files</h3>
                        <p>These wil be added to the current ones</p>
                        <ul>
                            {
                                this.state.uploadedAudioFiles && this.state.uploadedAudioFiles.map((f, key) => <li
                                    key={f.name + key.toString()}>
                                    <audio controls id="testTone" preload="metadata">
                                        <source src={f.preview} type="audio/mp3"/>
                                    </audio>
                                    {f.name} - {f.size} bytes
                                    <button onClick={() => {
                                        let newFiles = this.state.uploadedAudioFiles;
                                        delete newFiles[key];
                                        this.setState({
                                            uploadedAudioFiles: newFiles
                                        });
                                    }} className="btn btn-danger">
                                        Delete Audio File
                                    </button>
                                </li>)
                            }
                        </ul>
                    </div>)}

                    {this.state.uploadedImages.length > 0 && (<div className="preview">
                        <hr/>
                        <h3>Uploaded Images</h3>
                        <p>These wil be added to the current ones</p>
                        <ul>
                            {
                                this.state.uploadedImages && this.state.uploadedImages.map((f, key) => <li
                                    key={f.name + key.toString()}>
                                    <img src={f.preview} alt={Attraction.title}/>
                                    <button onClick={() => {
                                        let newFiles = this.state.uploadedImages;
                                        delete newFiles[key];
                                        this.setState({
                                            uploadedImages: newFiles
                                        });
                                    }} className="btn btn-danger">
                                        Delete Audio File
                                    </button>
                                </li>)
                            }
                        </ul>
                    </div>)}


                    {this.state.audioFiles.length > 0 && (<div className="preview">
                        <h3>Current Audio Files</h3>
                        <ul>
                            {
                                this.state.audioFiles && this.state.audioFiles.map((f, key) => <li
                                    key={f.name + key.toString()}>
                                    <audio controls id="testTone" preload="metadata">
                                        <source src={f} type="audio/mp3"/>
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
                        <h3>Current Images</h3>
                        <ul>
                            {
                                this.state.images && this.state.images.map((f, key) => <li
                                    key={f.original + key.toString()}>
                                    <img src={f.original} alt={Attraction.title}/>
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
                            {this.state.uploadLoading ? <LoadingIcon text={"Uploading..."}/> : "Update Attraction "}
                        </button>

                    </div>

                </form>


            </section>;
        } else {
            return <Loading/>;
        }


    }
}

export default compose(
    graphql(UpdateAttractionMutation, {
        name: "UpdateAttractionMutation",
    }),
    graphql(Attraction, {
        name: "Attraction",
        options: (props) => ({
            variables: {
                id: props.match.params.attractionId,
            },
            fetchPolicy: "no-cache",
        }),
    }),
)(EditAttraction);

