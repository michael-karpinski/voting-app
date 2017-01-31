import React, { Component } from 'react';
import Client from '../Client';
import {Link} from 'react-router';
import Header from '../Header';
import { TwitterButton, TwitterCount } from "react-social";
import {Chart} from 'react-google-charts';

import './index.css';

class Poll extends Component {
	constructor(props){
		super(props);
		this.state = {poll: {options: [], author: null}, user: {username: null}}
	}

	componentDidMount(){
		Client.get(`/api/poll/${encodeURIComponent(this.props.params.name)}`, (res) => {
			this.setState({poll: res});
			Client.get('/api/currentuser', (r) => {
	      this.setState({user: r.res})
	    });
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
		if(confirm('Are you sure?')){
			Client.del('/api/delete/', {name: this.state.poll.name}, function(res){
				if(res){
					window.location = '/';
				}
				else{
					alert("Sorry, you didn't create this poll.");
				}
			});
		}
	}

	add(){
		var option = prompt("Option");
		if(option !== '' && option !== null){
			Client.patch('/api/addoption/', {id: this.state.poll._id, option: option}, (res) => {
				this.setState({poll: res});
			});
		}
	}

  render(){
  	const creator = this.state.user && this.state.user.username === this.state.poll.author;
  	const loggedIn = this.state.user !== null;
  	let url='http://localhost:3000';
  	let text = `${this.state.poll.name} | Vote now at ${window.location.protocol}//${window.location.host}${window.location.pathname}`
  	const button = 
  	<a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(text)}>
			<div className='small-button'>Share</div>
		</a>
    let data = [
    	['Option', 'Votes']
    ]
    this.state.poll.options.forEach((option) => data.push([option.name, option.votes]));

    let options = {
    	backgroundColor: {fill: 'transparent'}
    }
    return (

    	
    	<div id='poll'>
    		<Header />
    		<div className='container'>
	    		<div className='row'>
	    		<div id='poll-text'>
			    	<h1 className='name'>{this.state.poll.name}</h1>
			    	<h2 className='center'><Link to={`/user/${this.state.poll.author}`}>{this.state.poll.author}</Link></h2>
			    	{this.state.poll.options.map( (option, i) => {
			    		return (
			    			<div id={`vote_${i}`}key={i} className='poll-button center' onClick={this.vote.bind(this)}>{option.name}</div>
			    		)
			    	})}
			    	<div className='center'>
			    		{loggedIn ? button : null }
			    		{loggedIn ? <Link onClick={this.add.bind(this)}><div className='small-button'>	Add Option</div></Link> : null}
			    	</div>
			    	<div className='center'>
			    		{creator ? <Link onClick={this.delete.bind(this)}><div className='small-button'>Delete</div></Link> : null }
			    	</div>
			    	
			    	
		    	</div>
		    	<div id='poll-chart' className='row end'>
			    	<Chart
			        chartType="PieChart" 
			        data={data}
			        options={options}
			        graph_id="chart"
			        legend_toggle
			       />
		       </div>
		      </div>
	      </div>
	    	
    	</div>
    );
  }
}

export default Poll;