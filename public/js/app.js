var name = getQueryVariable('name') || 'Anynomous';
var room = getQueryVariable('room')
var socket = io();

console.log(name + ' wants to join ' + room);
jQuery('.room-title').text(room);

socket.on('connect', () => {
  console.log("Connected to the socket io server!")
  socket.emit('joinRoom', {
    name: name,
    room: room
  })
})

socket.on('message', (message) => {
  var momentTimestamp = moment.utc(message.timestamp)
  console.log("New message: ");
  console.log(message.text);
  $message = jQuery('.message');
  $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>')
  $message.append('<p>' + message.text + '</p>')
})

// Hdndle submit message
var $form = jQuery('#message-form');

$form.on('submit', (event) => {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    name: name,
    text: $message.val()
  });

  $message.val('');
});