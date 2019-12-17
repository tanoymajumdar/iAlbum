import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import $ from 'jquery';
//import GalleryAlbum from './GalleryAlbum'

class AfterLogin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user_id: '',
            username: this.props.username,
            friends: this.props.friends,
            albumID: '',
            photoToEnlarge: ''
        };
        // this.listFriends();
        this.handleGetPhotoMy = this.handleGetPhotoMy.bind(this)
        this.listFriends = this.listFriends.bind(this)
        this.renderAlbum = this.renderAlbum.bind(this)
    }

    listFriends(){
        let stringHTML = []
        let alpha = this
        this.state.friends.forEach(function(value, index)
        {
            console.log(value);
            let friendID = value._id;
            let friendUser = value.username;
            stringHTML.push(
                <a className="Side-Bar" onClick={() => alpha.handleGetPhotoMy(friendID, friendUser)} key = {value._id} id={friendID}>{value.username}'s Album </a>
            )

        })
        this.setState({
            friends: stringHTML
        })
        return stringHTML;
    }


    handleGetPhotoMy(e, i){
        e.preventDefault()
        let users = {}
        $.ajax({
            url: "http://localhost:3002/getalbum/"+0,
            type: "GET",
            data: users,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (users) {
                    this.setState({
                        albumID : users._id
                    });
                    console.log(this.state.albumID)
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }.bind(this)
        });
    }

    renderAlbum(e){
        e.preventDefault()
        let users = {}
        let string = this.props.albumID
        $.ajax({
            url: "http://localhost:3002/getalbum/"+ string,
            type: "GET",
            data: users,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (users) {
                if (users['msg']) {
                    alert(users['msg']);
                } else {
                    this.setState({
                        albumID : users.userid
                    });
                    console.log(users.url)
                }
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }.bind(this)
        });
    }

    render(){
        return(
            <div>
                <div id={this.props.user_id} onClick={this.handleGetPhotoMy}> My Album </div>

                {console.log("Friends", this.state.friends)}
                <div>{this.state.friends}</div>
            </div>
        )
    }
}

export default AfterLogin;