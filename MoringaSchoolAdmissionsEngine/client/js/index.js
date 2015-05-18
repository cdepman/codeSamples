$(function(){

  // activate dropdown menu
  $(".dropdown-button").dropdown( { hover:true, belowOrigin: true, constrain_width: false, gutter: 0} );
  $(".progress").toggle();
  // keep track of which document the user is on
  var current = null;
  var socket = io();
  var error = '##Whoops!  \nCould Not Fetch from Database.  \n_File may not exist yet._'

  var toggleProgress

  // set up socket listeners for incoming updates
  socket.on('populateFullTimeA', function(data){
    !data ? editor.setValue(error) : editor.setValue(data.markdown);
    current = 'FullTimeA';
    $(".progress").toggle();
  });

  socket.on('populateFullTimeB', function(data){
    !data ? editor.setValue(error) : editor.setValue(data.markdown);
    current = 'FullTimeB';
    $(".progress").toggle();
  });

  socket.on('populatePartTimeA', function(data){
    !data ? editor.setValue(error) : editor.setValue(data.markdown);
    current = 'PartTimeA';
    $(".progress").toggle();
  });

  socket.on('populatePartTimeB', function(data){
    !data ? editor.setValue(error) : editor.setValue(data.markdown);
    current = 'PartTimeB';
    $(".progress").toggle();
  });

  // set up listeners on DOM elements to respond to user intents
  $('.FTA').on('click', function(){
    socket.emit('fetchFullTimeA');
    $(".progress").toggle();  
  });

  $('.FTB').on('click', function(){
    socket.emit('fetchFullTimeB');
    $(".progress").toggle();  
  });

  $('.PTA').on('click', function(){
    socket.emit('fetchPartTimeA');
    $(".progress").toggle();  
  });

  $('.PTB').on('click', function(){
    socket.emit('fetchPartTimeB');
    $(".progress").toggle();  
  });

  // set up listener and cooresponding action for save feature
  $('.saveToDB').on('click', function(){
    if (!current){console.log('No Email Selected'); return;}
    socket.emit('update' + current, { html: $('#out').html(), markdown: editor.getValue() });
  });

  // create Toast when save is successful
  socket.on('saveSuccess', function(){
    toast('Document Saved.', 2000, 'rounded', 'center');
  });

  // create Toast when save is not successful
  socket.on('saveFailure', function(){
    toast('Error: Document Not Saved.', 2000, 'rounded', 'center');
  });

});