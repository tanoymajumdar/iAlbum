import React from 'react';
import ReactDOM from 'react-dom';
//import './App.css';
import $ from 'jquery';
import Header from './components/Header';
import Login from './components/Login';
// import AfterLogin from './components/AfterLogin';


class App extends React.Component{
    constructor(props){
        super(props);
        // this.checkLog = this.checkLog.bind(this);
        this.state = {
            loginValue: false
        };

    }

    callbackFunction = (childData) => {
        this.setState({loginValue: childData})
    }
    render() {


        if (this.state.loginValue===false){
            return(
                <div>
                    <div className="Head">
                        <Header />
                    </div>
                    <div className="LoginP">
                        <Login
                            parentCallback = {this.callbackFunction}
                        />
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className="Head">
                        <Header />
                    </div>
                </div>
            )
        }

        // return(
        //     <div>
        //         <div className="Head">
        //             <Header />
        //         </div>
        //         <div className="LoginP">
        //             <Login
        //             // func={this.checkLog}
        //             />
        //         </div>
        //     </div>
        //
        //
        // )
    }

}

export default App;

