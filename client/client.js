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
Messages = new Meteor.Collection('messages');

BOARDX = 700;
BOARDY = 500;

Meteor.startup(function () {
  paper = Raphael('paper', BOARDX, BOARDY);

  // getByMid allows us to get the element in paper by its asociated MongoDB id
  // using mid because matching up Raphael paper ids across clients is not reliable
  paper.getByMid = function (mid) {
    var bot = this.bottom;
    while (bot) {
        if (bot.mid == mid) {
            return bot;
        }
        bot = bot.next;
    }
    return null;
  };

  setupBoard();

  // TODO: Come up with something better than using a random float
  // there is the possibility of collision, albeit very low
  Session.set('player_id', Math.random() * 10);

  Meteor.subscribe('pieces');
  Meteor.subscribe('messages');

});

Template.options.events({
  'click input.resetGoban' : function () {
    Meteor.call('resetGoban', Session.get('player_id'));
  },

  'click input.resetMessages' : function () {
    Meteor.call('resetMessages', Session.get('player_id'));
  }
});

Template.chat.messages = function () {
  return Messages.find({}, {sort: {time: -1}});
};

Template.chatinput.events = {
  "keydown #message": function(event){
    if(event.which == 13){
      var name = document.getElementById('name');
      var message = document.getElementById('message');

      if(name.value != '' && message.value != ''){
        Meteor.call('addMessage', name.value, message.value, Session.get('player_id'));

      message.value = '';
      }
    }
  }
}

Pieces.find().observe({

  added: function (piece) {
    thePiece = goPiece(piece.color, piece.cx, piece.cy, piece._id)
  },

  changed: function (piece) {
    // Don't update local paper if local user made the last change to DB
    if (Session.get('player_id') != piece.lastplayer) {
        paper.getByMid(piece._id).movePiece(piece.cx, piece.cy);
    }
  },
  
  removed: function (piece) {
    paper.getByMid(piece._id).remove();
  }
});