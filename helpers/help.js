const moment = require('moment');

module.exports = {
  

  DateSet: function(date, format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  alterIcon: function(postUser, loggedUser, postId, floating = true){
    if(postUser == loggedUser){
      if(floating){
        return `<a href="/posts/edit/${postId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/posts/edit/${postId}"></a>`;
      }
    } else {
      return '';
    }
  }
}

