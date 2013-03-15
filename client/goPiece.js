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

function goPiece (color, x, y, mid) {

  var thePiece = paper.circle(x, y, 8, 8)
                      .attr({stroke: '#000',
                             'fill': color == 'black' ? '#000000' : '#FFFFFF'});

  thePiece.color = color;
  thePiece.getcx = function () { return thePiece.attr('cx'); };
  thePiece.getcy = function () { return thePiece.attr('cy'); };
  thePiece.setcx = function (cx) {thePiece.attr({cx: cx})};
  thePiece.setcy = function (cy) {thePiece.attr({cy: cy})};

  thePiece.movePiece = function (cx, cy) {
    this.setcx(cx);
    this.setcy(cy);
  };

  thePiece.beginMove = function () {
    // Store original coordinates in the object
    this.ox = this.getcx();
    this.oy = this.getcy();
    this.animate({r: 10, opacity: .5}, 200, ">");
  };

  thePiece.moving = function (dx, dy) {
    this.movePiece(this.ox + dx, this.oy + dy);
    Meteor.call('updatePiece', this.mid, this.color, this.getcx(), this.getcy(), Session.get('player_id'));
  };

  thePiece.doneMoving = function () {
    this.animate({r: 8, opacity: 1}, 200, ">");
  };

  thePiece.drag(thePiece.moving, thePiece.beginMove, thePiece.doneMoving);

  // Mongo id
  // Use this as id instead of Raphael paper ids, because clients can end up
  // with diff rids for the same piece
  thePiece.mid = mid

  return thePiece;
};