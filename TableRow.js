import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import $ from 'jquery';
// import App from './App';
import AfterLogin from './AfterLogin';

class TableRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.data.id}</td>
                <td>{this.props.data.name}</td>
                <td>{this.props.data.age}</td>
            </tr>
        );
    }
}

export default  TableRow;