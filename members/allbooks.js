var Linker = React.createClass({
	render: function(){
		return  <div className = 'outs'>
					<a href="/members/profile.html" className="button">Profile</a>
					<a href="/members/books.html" className="button">My books</a>
					<a href="/members/booksearch.html" className="button">Add a book</a>
					<a href="/members/requests.html" className="button">Handle requests </a>
					<a href="/logout" className="button">Log out</a>
				</div>
	}
});

var Show =  React.createClass({
  getInitialState: function(){
     return {
     	array: this.props.arr,
     	index: -5}
  },
  show: function(ind){
  	this.setState({index: ind});
  },
  request: function(){
  	$.get( "/requestBook", {book: this.state.array[this.state.index]})
			.done(function(data) {});
  },
  render: function(){
  	var details,
  		bookDet;
  	if (this.state.index !==-5){
  		bookDet = this.state.array[this.state.index];
  		details=	<div>	
  						<div className = "booklist" >
                            <img className= "cover" src={bookDet.link}/>
                             <p className = "descr" ><span>{bookDet.author+":"}<br/>{bookDet.title}<br/>
                             {bookDet.description}</span></p>
                        </div>
                           <button className = "request" onClick = {this.request}>Request</button>
                     </div>
  	}
  	return  <div>
  				<Linker></Linker>
  				{details}
  				<p><span>Hover  over  cover for description, click for details/request. Check resulting request(s) in 'Handle requests'</span></p>
  				{this.state.array.map((listValue, index)=>{
                return   <img title = {listValue.author+": "+ listValue.title} className= "cover"
                            onClick = {()=> this.show(index)} key = {index}
                             src={listValue.link}/>

  				})}			
  			</div>
  }
});

$(document).ready(function() {
	$.get( "/allbooks", {})
			.done(function(data) {
				ReactDOM.render(<Show arr = {data.raw}></Show>,
        				document.getElementById('box'));
			});
});