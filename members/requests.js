var Show = React.createClass({
	getInitialState: function(){
     return {
     	wishes: this.props.wishes,
     	myRequests: this.props.requests,
     	accepted: this.props.accepted,
     	showOff: null,
     	showBook: null,
      showInd: null,
      accept: false
     	}
  	},
 	showAcc: function(ind){
  		var self = this;
  		var bookHold= this.state.accepted[ind].book;
      var  reqIndex = this.state.accepted[ind].id;
  		$.get( "/getPartner", {id: this.state.accepted[ind].partner, email: true})
			.done(function(data) {
				
				self.setState({accept: true, showOff: data, showBook: bookHold, showInd: reqIndex});
			});
  	},
 	showReq: function(ind){
  		var self= this;
  		var bookHold= this.state.myRequests[ind].book;
      var  reqIndex = this.state.myRequests[ind].id;
  		$.get( "/getPartner", {id: this.state.myRequests[ind].partner, email: false})
	   		.done(function(data) {
				self.setState({accept: false, showOff: data, showBook: bookHold, showInd: reqIndex});
			});
  	},
   removeWish: function(numb){
      var temp = this.state.wishes.slice();
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].book.ISBN === numb){
           temp.splice (i,1);
           i--;
        }
      }
      this.setState({ wishes: temp.slice()});
      $.get( "/removeReq", {ISBN: numb, type: "wish"})
        .done(function(data) {});
    },
  removeShow: function(){
      var index = this.state.showInd;
      var temp;
      if (this.state.accept) {
        temp = this.state.accepted.slice();
        console.log(this.state.accepted[0].id, index)
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].id === index) {
            temp.splice(i,1);
            break;
          }
        }
        this.setState({
          accepted: temp.slice(),
          showOff: null,
          showBook: null,
          showInd: null,
          accept: false
        });
        $.get( "/removeReq", {id: index, type: "delete"})
          .done(function(data) {});
      }else{
        temp = this.state.myRequests.slice();
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].id === index) {
            temp.splice(i,1);
            break;
          }
        }
        this.setState({
          myRequests: temp.slice(),
          showOff: null,
          showBook: null,
          showInd: null,
          accept: false
        });
        $.get( "/removeReq", {id: index, type: "delete"})
          .done(function(data) {});
      }
    },
  acceptShow: function(){
      var index = this.state.showInd;
      var temp = this.state.myRequests.slice();
      var temp2 = this.state.accepted.slice()
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].id === index) {
          var holder = temp.splice(i,1);
          temp2.push(holder[0]);
          break;
        }
      }
      this.setState({
          accepted: temp2.slice(),
          myRequests: temp.slice(),
          showOff: null,
          showBook: null,
          showInd: null,
          accept: false
        });
      $.get( "/removeReq", {id: index, type: "accept"})
        .done(function(data) {});
    },
 	render: function(){
  		var extras,
  			mailer,
        hide = "double";
        if (this.state.accept) { hide += ' invisible'}
  		if (this.state.showOff) {
  			extras= <div>
  						<img title = {this.state.showBook.author+": "+ this.state.showBook.title} className= "cover"
                         src={this.state.showBook.link}/>
                         <button className= "over" onClick= {this.removeShow}>Remove</button>                            
                         <button className= {hide} onClick= {this.acceptShow}>Accept</button>
                         <p><span>Potential partner:{this.state.showOff.name}</span></p>
                         <p><span>In:{this.state.showOff.location}</span></p>
  					</div>;
  		}
  		if (this.state.showOff && this.state.showOff.email !== "") {
  			mailer =<div>
  			 <p><span>Contact:{this.state.showOff.email}</span></p>
  			 <p><span>If I believed someone would ever use this, I would need to make messages inside the app...</span></p>
  			 		</div>
  		}
  		return  <div>
  					<p><span>Click on book covers to see extra info/options.</span></p>
  					{extras}
            {mailer}
  					<p><span>My wishlist:</span></p>
            <div>
  					{this.state.wishes.map((listValue, index)=>{
                		return   <div className= "wrapper">
                    <img title = {listValue.book.author+": "+ listValue.book.title} className= "cover"
                            key = {index} src={listValue.book.link}/>
                    <button className= "over" onClick = {()=> this.removeWish(listValue.book.ISBN)}>Remove</button>
                            </div>
	  				})}
            </div>
  					<p><span>Other people requests:</span></p>
  					{this.state.myRequests.map((listValue, index)=>{
                		return  <img title = {listValue.book.author+": "+ listValue.book.title} className= "cover"
                            key = {index} onClick = {()=> this.showReq(index)} src={listValue.book.link}/>
	  				})}	
  					<p><span>My accepted:</span></p>
  					{this.state.accepted.map((listValue, index)=>{
                		return   <img title = {listValue.book.author+": "+ listValue.book.title} className= "cover"
                            key = {index} onClick = {()=> this.showAcc(index)} src={listValue.book.link}/>
	  				})}			  					
  				</div>
  	}
});

$(document).ready(function() {
	$.get( "/getrequests", {})
			.done(function(data) {
				ReactDOM.render(<Show wishes = {data.wishes} requests = {data.requests} accepted= {data.accepted}></Show>,
        				document.getElementById('target'));
			});
});