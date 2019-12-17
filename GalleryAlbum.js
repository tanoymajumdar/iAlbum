import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import $ from 'jquery';

class GalleryAlbum extends React.Component{
    constructor(){
        super();
            this.state = {
                EnlargePhotoID : '',
                albumID: ''
        }
        this.displayPicture = this.displayPicture.bind(this)
    }

    displayPicture(e){
        e.preventDefault()
    }

}

export default GalleryAlbum