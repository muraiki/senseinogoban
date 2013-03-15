// Sensei no Goban, an online Go board
// Copyright (C) 2013 Erik Ferguson

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Pieces = new Meteor.Collection('pieces');
PiecesMeta = new Meteor.Collection('pieces_meta');
Messages = new Meteor.Collection('messages');
MessagesMeta = new Meteor.Collection('messages_meta');

BOARDX = 700;
BOARDY = 500;
CHATLIMIT = 40;
PIECELIMIT = 362;

Meteor.startup(function () {

  console.log("Sensei no Goban Copyright (C) 2013 Erik Ferguson");
  console.log("This program comes with ABSOLUTELY NO WARRANTY.");
  console.log("This is free software, and you are welcome to redistribute it under certain conditions as specified in LICENSE.txt");

  if (PiecesMeta.find().count() === 0) {
    PiecesMeta.insert({totalcount: true, count: 0});
  }
  if (MessagesMeta.find().count() === 0) {
    MessagesMeta.insert({totalcount: true, count: 0});
  }

  Meteor.publish("pieces", function () {
    return Pieces.find();
  });

  Meteor.publish("messages", function () {
    return Messages.find();
  });

  // Enable for debugging
  // listDB();

});

Meteor.methods({
  resetGoban: function (player_id) {
    // TODO: Trusting client to give proper player_id, probably not the best idea ;)
    console.log("Reset Goban:", player_id)
    Pieces.remove({});
    PiecesMeta.remove({});
    PiecesMeta.insert({totalcount: true, count: 0});
  },

  addPiece: function (color, cx, cy, lastplayer) {

    if (validateInput({color: color, cx: cx, cy: cy, player_id: lastplayer})) {

      // Make sure there are not too many pieces on the board
      if (PiecesMeta.find({totalcount: true}).fetch()[0].count < PIECELIMIT) {
        Pieces.insert({color: color,
                       cx: cx,
                       cy: cy,
                       lastplayer: lastplayer});
        PiecesMeta.update({totalcount: true}, {$inc: {count: 1}}); // Put this in a callback in case adding fails?
      } else {
        console.log("Too many pieces:", PiecesMeta.find({totalcount: true}).fetch()[0].count);
        Messages.insert({name: 'Server', message: 'Too many pieces on the board.', player_id: '42', time: Date.now()});
      }

    }
    else {
      console.log("Invalid input from", lastplayer);
      Messages.insert({name: 'Server', message: 'Invalid add data received.', player_id: '42', time: Date.now()});
    }

  },

  updatePiece: function (mid, color, cx, cy, lastplayer) {
    if (validateInput({color: color, cx: cx, cy: cy, mid: mid, player_id: lastplayer})) {
      Pieces.update(mid,
                    {color: color,
                     cx: cx,
                     cy: cy,
                     lastplayer: lastplayer});
    } else {
      console.log("Invalid input from", lastplayer);
      Messages.insert({name: 'Server', message: 'Invalid update data received.', player_id: '42', time: Date.now()});
    }
  },

  resetMessages: function (player_id) {
    // TODO: Trusting client to give proper player_id, probably not the best idea ;)
    Messages.remove({});
    MessagesMeta.insert({totalcount: true, count: 0});
  },

  addMessage: function (name, message, player_id) {
    // TODO: Trusting client to give proper player_id, probably not the best idea ;)
    
    // Force messages reset after so many messages
    if (MessagesMeta.find({totalcount: true}).fetch()[0].count > CHATLIMIT) {
      Messages.remove({});
      MessagesMeta.remove({});
      MessagesMeta.insert({totalcount: true, count: 0});
    }

    // TODO: If auth is implemented, no need for both name and pid
    Messages.insert({
      name: name,
      message: message,
      player_id: player_id,
      time: Date.now()
    });
    MessagesMeta.update({totalcount: true}, {$inc: {count: 1}});
  }

});

function validateInput(inputObj) {
  // requires at least color, cx, cy, player_id. mongo id optional.
  if (  (inputObj.color == 'black' || 'white')
     && ( (inputObj.cx < BOARDX) && (inputObj.cx > 0) )
     && ( (inputObj.cy < BOARDY) && (inputObj.cy > 0) )
     && inputObj.player_id
     && inputObj.mid ? undefined !== Pieces.findOne(inputObj.mid) : true
     )
    return true;
  else return false;
}

function listDB () {
  console.log("--- Initial DB ---");
  Pieces.find().forEach(function (piece) {
    var currentime = new Date();
    var hours = currentime.getHours();
    var minutes = currentime.getMinutes();
    console.log(hours + ":" + minutes + " - Found in db: "  + piece.cx + " " + piece.cy
                + " " + piece.color + " " + piece._id + " " + piece.lastplayer)
  });
  console.log("------------------");
}

// Enable for debugging
// Pieces.find().observe({
//   changed: function(piece) {
//     var currentime = new Date();
//     var hours = currentime.getHours();
//     var minutes = currentime.getMinutes();
//     console.log(hours + ":" + minutes + " - " + piece.lastplayer + " updated in db: " + piece.cx + " " + piece.cy)
//   }
// });