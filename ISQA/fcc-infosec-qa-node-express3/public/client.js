$( document ).ready(function() {
  /*global io*/
  var socket = io();
  
  socket.on('user', function(data){
    $('#num-users').text(data.currentUsers + ' users online');
    let msg = data.name;
    if (data.connected) msg += ' has joined the chat.';
    else msg += ' has left the chat.';
    $('#messages').append($('<li>').html('<b>'+msg+'<\/b>'));
  });
  
  // Form submittion with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    socket.emit('chat message', messageToSend);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  socket.on('chat message', (data) => {
    $('#messages').append($('<li>').text(data.name+': '+data.message));
  });
  
});
