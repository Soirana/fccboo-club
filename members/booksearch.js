
var Searcher =  React.createClass({
  getInitialState: function(){
     return {
      array: [],
      searched: false
     }
  },
  searchText: function(){
    var line = this.refs.searcher.value;
    self = this;
    if (line!==""){
      $.get( "https://www.googleapis.com/books/v1/volumes", {q: line})
            .done(function( data ) {
              if (data.totalItems>0){
                self.setState({searched: true,
                              array: data.items.slice(0,10)});
            } else{
                self.setState({searched: true});
            }
      });
    }
  },
  searchISBN: function(){
    var line = 'isbn:'+this.refs.searchNumb.value;
    if (line!=="isbn:"){
      self= this;
      $.get( "https://www.googleapis.com/books/v1/volumes", {q: line})
          .done(function( data ) {
            if (data.totalItems>0){
                  self.setState({searched: true,
                              array: data.items})
            } else{
                self.setState({searched: true});
            }
      });
   }
  },
  handleAdd: function(book){
    this.setState({
            searched: false,
            array: []});
    this.refs.searchNumb.value = "";
    this.refs.searcher.value = "";
    $.get( "/addBook", {
                        ISBN: book.volumeInfo.industryIdentifiers[1].identifier,
                        author: book.volumeInfo.authors,
                        title: book.volumeInfo.title,
                        description: book.volumeInfo.description,
                        link: book.volumeInfo.imageLinks.thumbnail
    })
            .done(function( data ) {

            });
  },
  render: function(){
    var emptyLine,
        lastEl = "";
    if (this.state.searched){
      emptyLine = 'No results... maybe search something else.';
    } else{
      emptyLine = 'Maybe search something.';
    }
    if (this.state.array.length === 0) {
      lastEl = <p className = 'searchin'>{emptyLine}</p>
    }
    return  <div>
              <p>To add book properly, please, enter part of title/author name and hit search button. Then select
              matching result and hit Add button. If book does not show in results either be more specific or use search by ISBN number
              option. </p>
              <input ref= 'searcher' placeholder= "Search by author/title" className = 'searchin'></input>
              <button onClick = {this.searchText} className= 'searchbut'>Search</button><br/>
              <input ref= 'searchNumb'  placeholder= "or by ISBN number" className= 'searchin'></input>
              <button className= 'searchbut' onClick = {this.searchISBN}>Search</button>
              {lastEl}
              {this.state.array.map((listValue, index)=>{
                var linkRep;
                if (!listValue.volumeInfo.imageLinks){
                  linkRep = '/members/profile.jpg'
                } else{
                  linkRep =listValue.volumeInfo.imageLinks.thumbnail;
                }
                return  <div className = "booklist" key = {index}>
                            <img className= "cover" src={linkRep}/>
                             <p className = "descr" >{listValue.volumeInfo.authors+":"}<br/>{listValue.volumeInfo.title}<br/>
                             {listValue.volumeInfo.description}</p>
                             <button onClick= {()=> this.handleAdd(listValue)} className= "addBut">Add</button>
                        </div>
              })}
            </div>
  }
});

ReactDOM.render(<Searcher></Searcher>,
        document.getElementById('box')
      );