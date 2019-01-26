//Example from Codepen - changed and redesigned by Mohamad Moghadam

import moment from "moment";
import React from "react";
import {compose, graphql} from "react-apollo";
import {addCommentMutation as addCommentToAttraction} from "../../graphql/mutations/attraction/attractionMutations";
import {addCommentMutation as addCommentToRoute} from "../../graphql/mutations/route/routeMutations";
import {Attraction} from "../../graphql/queries/attraction/attractionQueries";
import {Route} from "../../graphql/queries/route/routeQueries";

import {getIdFromToken, loggedIn} from "../../helpers";
import LoadingIcon from "./LoadingIcon";
import Stars from "./Stars";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.handleUrlAndState = this.handleUrlAndState.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.checkIfUserCommented = this.checkIfUserCommented.bind(this);
        this.state = {
            tab: 0,
            comment: "",
            rating: undefined
        };
    }

    handleUrlAndState(tab) {
        this.setState({
            tab
        });
    }

    checkIfUserCommented() {
        const userId = loggedIn() ? getIdFromToken() : null;
        this.props.ratings && this.props.ratings.map(rating => {
            if (rating.userId === userId) {
                this.setState({
                    rating: rating.rating,
                    comment: rating.comment,
                    commented: true
                });
            }
        });
    }

    componentDidMount() {
        this.checkIfUserCommented();
    }

    handleComment(event) {
        this.setState({loadingEdit: true});
        event.preventDefault();
        this.props.type === "attraction" ? this.props.addCommentToAttraction({
                variables: {
                    attractionId: this.props.id,
                    comment: this.state.comment,
                    rating: this.state.rating
                },
                update: (store, res) => {
                    try {
                        let newRating = res.data.addCommentAndRatingForAttraction;
                        let storeData = store.readQuery({query: Attraction, variables: {id: this.props.id,}});
                        storeData.SingleAttraction.ratings = newRating.ratings;
                        store.writeQuery({query: Attraction, variables: {id: this.props.id,}, data: storeData});
                    } catch (err) {
                        console.info(err);
                    }
                }
            }).then(() => this.setState({editingComment: false, loadingEdit: false, commented: true,}))
            :
            this.props.addCommentToRoute({
                variables: {
                    routeId: this.props.id,
                    comment: this.state.comment,
                    rating: this.state.rating
                },
                update: (store, res) => {
                    try {
                        let newRating = res.data.addCommentAndRatingForRoute;
                        let storeData = store.readQuery({query: Route, variables: {id: this.props.id,}});
                        storeData.SingleRoute.ratings = newRating.ratings;
                        store.writeQuery({query: Route, variables: {id: this.props.id,}, data: storeData});
                    } catch (err) {
                        console.info(err);
                    }
                }
            }).then(() => this.setState({editingComment: false, loadingEdit: false, commented: true,}));

        this.checkIfUserCommented();
    }

    render() {
        let commented = this.state.commented;
        const userId = loggedIn() ? getIdFromToken() : null;
        return <section id={"Comments"}>
            <div className="comments">

                {this.props.ratings ? this.props.ratings.map((rating, key) => {


                    if (this.state.editingComment && userId === rating.userId) {
                        return <article className="comment" key={rating.userId + key}>
                            <div className="comment-body">
                                <div className="text">
                                    <p>Your updated comment will be here</p>
                                </div>
                            </div>
                        </article>;
                    } else {
                        return <article className="comment" key={rating.userId + key}>
                            <div className="comment-body">
                                <div className="text">

                                    <p>{rating.comment}</p>
                                    <Stars editing={false} rating={rating.rating}/>
                                </div>
                                <p className="attribution">by {userId === rating.userId ? "You" : rating.userName} at {moment(rating.created_at * 1000).format("MMMM Do YYYY, HH:mm")}</p>
                            </div>
                        </article>;
                    }
                }) : <p className="no_comments alert alert-info">There are currently no ratings or comments</p>}


            </div>

            {loggedIn() ? (
                <form id="" className="form-group comment-form" onSubmit={(event) => this.handleComment(event)}>
                    {!commented ? <div className="createCommentArea">
                                            <textarea
                                                name="comment"
                                                onChange={(item) => this.setState({comment: item.target.value})}
                                                form="userform"
                                                className="form-control"
                                                rows="4" cols="50"
                                                placeholder="Enter comment here..."
                                                value={this.state.comment}>

                    </textarea>
                        <p>Rating:</p>
                        <Stars editing={true} onChange={(value) => this.setState({rating: value})}/>
                        <button type="submit" id="createComment"
                                className="btn btn-success comment-create startAnywayButton"
                                disabled={this.state.comment === "" || this.state.rating === undefined}>{this.state.loadingEdit ?
                            <LoadingIcon/> : "Create Comment"}</button>
                    </div> : <div>
                        {!this.state.editingComment &&
                        <p className="alert alert-info">It seems that you have already rated this attraction, you can
                            only edit this rating or delete
                            it by pressing the cross over it or press the button below</p>}

                        {!this.state.editingComment && <button className="btn btn-primary startAnywayButton"
                                                               onClick={() => this.setState({editingComment: true})}>Edit
                            Comment</button>}
                    </div>}
                    {this.state.editingComment && <div className="createCommentArea">
                                            <textarea
                                                name="comment"
                                                onChange={(item) => this.setState({comment: item.target.value})}
                                                form="userform"
                                                className="form-control"
                                                rows="4" cols="50"
                                                placeholder="Enter comment here..."
                                                value={this.state.comment}>

                    </textarea>
                        <p>Rating:</p>
                        <Stars editing={true} onChange={(value) => this.setState({rating: value})}
                               rating={this.state.rating}/>
                        <button type="submit" id="createComment"
                                className="btn btn-success comment-create startAnywayButton"
                                disabled={this.state.comment === "" || this.state.rating === undefined}> {this.state.loadingEdit ?
                            <LoadingIcon/> : "Update Comment"}</button>
                    </div>}

                </form>) : (<p className="alert alert-info">You must be logged in to write comments! </p>)}


        </section>;

    }
}

export default compose(
    graphql(addCommentToAttraction, {
        name: "addCommentToAttraction",
    }),
    graphql(addCommentToRoute, {
        name: "addCommentToRoute",
    }),
)(Comments);
