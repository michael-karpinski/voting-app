import React, { Component } from 'react';
import Client from '../Client';
import {Link} from 'react-router';
import Header from '../Header';

class Poll extends Component {
	constructor(props){
		super(props);
		this.state = {poll: {options: [], author: null}, user: null}
	}

	componentDidMount(){
		Client.get(`/api/poll/${encodeURIComponent(this.props.params.name)}`, (res) => {
			this.setState({poll: res});
		});
	}

	vote(e){
		var option = e.target.innerHTML;
		Client.patch(`/api/addvote/`, {name: this.state.poll.name, option: option},  (res) => {
			if(res){
				this.setState({poll: res});
			}
			else{
				alert('You already voted!');
			}
		});
	}

	delete(){
		Client.del('/api/delete/' + encodeURIComponent(this.state.poll.name), this.state.poll.name);
	}

	add(){
		var option = prompt("Option");
		Client.patch('/api/addoption/', {id: this.state.poll._id, option: option}, (res) => {
			this.setState({poll: res});
		});
	}

  render(){
    return (
    	<div id='poll'>
    		<Header />
	    	<h1>{this.state.poll.name}</h1>
	    	<h2>{this.state.poll.author}</h2>
	    	{this.state.poll.options.map( (option, i) => {
	    		return (
	    			<p id={`vote_${i}`}key={i}><span className='name' onClick={this.vote.bind(this)}>{option.name}</span> - {option.votes}</p>
	    		)
	    	})}
	    	<Link to='/'>Home</Link>
	    	<Link onClick={this.delete.bind(this)}>Delete</Link>
	    	<Link onClick={this.add.bind(this)}>Add</Link>
    	</div>
    );
  }
}

export default Poll;
