var Show =  React.createClass({
  getInitialState: function(){
     return {array: this.props.arr}
  },
  render: function(){
  	return  <div>
  				{this.state.array.map((listValue, index)=>{
                return  <div className = "booklist" key = {index}>
                            <img className= "cover" src={listValue.link}/>
                             <p className = "descr" >{listValue.author+":"}<br/>{listValue.title}<br/>
                             {listValue.description}</p>
                        </div>
  				})}			
  			</div>
  }
});

$(document).ready(function() {
	$.get( "/mybooks", {})
			.done(function(data) {
				ReactDOM.render(<Show arr = {data.raw}></Show>,
        				document.getElementById('box'));
			});

});