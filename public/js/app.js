var name = getQueryVariable('name');
var room = getQueryVariable('room')
var socket = io();

socket.on('connect', () => {
  console.log("Connected to the socket io server!")
})

socket.on('message', (message) => {
  var momentTimestamp = moment.utc(message.timestamp)
  console.log("New message: ");
  console.log(message.text);

  jQuery('.message').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ': <strong>' + message.text + '</p>');
})

// Hdndle submit message
var $form = jQuery('#message-form');

$form.on('submit', (event) => {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val()
  });

  $message.val('');
});