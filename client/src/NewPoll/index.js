import React, {Component} from 'react';
import Client from '../Client';
import {Link} from 'react-router';
import Header from '../Header';
import './index.css';

class NewPoll extends Component {
	constructor(props){
		super(props);
		this.state = {num: 3}
	}

	addOption(e){
		e.preventDefault();
		this.setState({num: this.state.num + 1})
	}

	componentDidMount(){
    Client.get('/api/currentuser', (res) => {
    	if(res.res == null){
    		alert('You need to be signed in!');
    		window.location = '/';
    	}
    });
  }
	
	render() {
		var inputs = [];
		for(var i = 0; i < this.state.num; i++){
			inputs.push(<div key={i} className='center row'><input name='option' className='form-input' placeholder='Option' autoComplete='off'/><br/></div>)
		}
		return (
			<div>
				<Header />
				<form action='api/newpoll' method='POST'>
					<div className='center row'>
						<input name='name' className='form-input' placeholder='Name' autoComplete='off'/>
					</div>
					{inputs}
					<div className='center row'>
						<button onClick={this.addOption.bind(this)} className='button form-input-button'>Add Option</button>
						<input type='submit' className='button form-input-button' id='submit-poll' value='Submit Poll'/>
					</div>
				</form>
			</div>
		)
	}
}

export default NewPoll;