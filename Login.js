import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import $ from 'jquery';
// import App from './App';
import AfterLogin from './AfterLogin';
// import TableRow from './TableRow';


class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            frindsList: '',
            userID: '',
            login_stat: false,
            error: '',
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.listFriends = this.listFriends.bind(this);
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {
        let string = "<div>";
        evt.preventDefault();

        if (this.state.username === '' || this.state.password === '') {
            alert('Please fill all fields');
        }
        else{
            let users = {'username':this.state.username, 'password': this.state.password};
            console.log(this.state.username);
            $.ajax({
                url: "http://localhost:3002/login",
                type: "POST",
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
                            login_stat: true,
                            userID: users._id,
                            username: users.person,
                            friendsList: users.friendsList
                        });
                        //console.log(this.state.frindsList['username']);
                        document.getElementById("form-sub").style.display = 'none';
                        // $("form-sub").remove();
                        document.getElementById("afterLogin").style.display = 'block';
                        console.log(this.state.friendsList[0].username);
                        // console.log(this.state.friends.length);

                    }
                }.bind(this),
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                    alert("Please give the correct Username and password")

                }.bind(this)
            });
        }
    }

    handleUserChange(evt){
        this.setState({
            username: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }

    handleLogout(e){
        e.preventDefault();
        window.location.href="AlbumService/myreactapp/src/App.js";

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


    render()
        {
            return (
                <div id="mainPage">
                    <form id="form-sub" onSubmit={this.handleSubmit}>
                        {
                            this.state.error &&
                            <h3 data-test="error" onClick={this.dismissError}>
                                <button onClick={this.dismissError}>✖</button>
                                {this.state.error}
                            </h3>
                        }
                        <label>UserName</label>
                        <input type="text" data-test="username" value={this.state.username}
                               onChange={this.handleUserChange}/>

                        <label>Password</label>
                        <input type="password" data-test="password" value={this.state.password}
                               onChange={this.handlePassChange}/>

                        {/*<input type="submit" value="Log In" data-test="submit" onClick={ this.sendData}/>*/}
                        <input type="submit" value="Log In" data-test="submit" />
                    </form>
                    <div id="afterLogin">

                        <nav>
                            Welcome
                            {this.state.username}!!
                            <input type="button" value="Log Out" id="LogOut" onClick={this.handleLogout}/>
                            {/*<input type="button" value="Log Out" onClick={this.props.history.push("AlbumService/myreactapp/src/App.js")}/>*/}
                        </nav>
                        <div id="leftMenu">
                            {console.log("Friends=", this.state.friends)}
                        </div>
                    </div>
                </div>
            );
        }
}


export default Login;