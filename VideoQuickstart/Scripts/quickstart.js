var conversationsClient;
var activeConversation;
var previewMedia;
var identity;


// Verificar WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
}

$.getJSON('/token', function (data) {

    identity = data.identity;
    var accessManager = new Twilio.AccessManager(data.token);
    console.log(identity);
    // Crea un cliente de conversaciones y conéctate a Twilio
    conversationsClient = new Twilio.Conversations.Client(accessManager);
    conversationsClient.listen().then(clientConnected, function (error) {
        console.log('Could not connect to Twilio: ' + error.message);
        log('Could not connect to Twilio: ' + error.message);
    });
});


// ¡Conectado con éxito!
function clientConnected() {
    document.getElementById('invite-controls').style.display = 'block';
    log("Connected to Twilio. Listening for incoming Invites as '" + conversationsClient.identity + "'");

    conversationsClient.on('invite', function (invite) {
        log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);
    });


// Botón de enlace para crear conversación
    document.getElementById('button-invite').onclick = function () {
        var inviteTo = document.getElementById('invite-to').value;
        if (activeConversation) {
        // Añadir un participante
        activeConversation.invite(inviteTo);
        } else {

            // Crear una conversación
            var options = {};
            if (previewMedia) {
                options.localMedia = previewMedia;
            }
            conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted, function (error) {
                log('Unable to create conversation');
                console.log('Unable to create conversation: ' + error.message);
                console.error('Unable to create conversation', error);
            });
        }
    };
}


// La conversación es en vivo
function conversationStarted(conversation) {
    log('In an active Conversation');
    activeConversation = conversation;
   // Dibujar video local, si no esta ya vista previa
    if (!previewMedia) {
        conversation.localMedia.attach('#local-media');
    }


// Cuando un participante se une, dibuja su video en pantalla
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#remote-media');
    });


// Cuando un participante se desconecta, anote en el registro
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
    });


// Cuando la conversación termina, deja de capturar el video local
    conversation.on('ended', function (conversation) {
        log("Connected to Twilio. Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
    });
}


// Vista previa del video local
document.getElementById('button-preview').onclick = function () {
    if (!previewMedia) {
        previewMedia = new Twilio.Conversations.LocalMedia();
        Twilio.Conversations.getUserMedia().then(
        function (mediaStream) {
            previewMedia.addStream(mediaStream);
            previewMedia.attach('#local-media');
        },
        function (error) {
            console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone');
        });
    };
};


// Registro de actividades
function log(message) {
    console.log(message);
    document.getElementById('log-content').innerHTML = message;
}
