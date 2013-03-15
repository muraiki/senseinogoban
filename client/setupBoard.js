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

var setupBoard = function () {

  setupGoban();

  setupBowls();

};

function setupGoban () {
  // Based off of svg in public domain: http://commons.wikimedia.org/wiki/File:Blank_Go_board.svg
  // Converted using http://readysetraphael.com/
  var rect_a = paper.rect(0, 0, 96, 96);
  rect_a.attr({fill: '#DCB35C','stroke-width': '0','stroke-opacity': '1'}).data('id', 'rect_a');
  var path_b = paper.path("M2.9,93h90.2m-.2-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m0-5h90m0-5H3m-.1-5h90.2M3,3V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3m5,0V93m5,0V3");
  path_b.attr({stroke: '#000',"stroke-width": '0.2',fill: 'none','stroke-opacity': '1'}).data('id', 'path_b');
  var path_c = paper.path("M18,78l0,0m30,0l0,0m30,0l0,0m0-30l0,0m-30,0l0,0m-30,0l0,0m0-30l0,0m30,0l0,0m30,0l0,0");
  path_c.attr({stroke: '#000',"stroke-width": '4',"stroke-linecap": 'round','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_c');
  var goban = [rect_a, path_b, path_c];

  // Scale goban up since rsr outputs reduced size
  for(var i = 0; i < goban.length; i++) {
    goban[i].transform('S5,5,0,0');
  };
}

function setupBowls () {

  var createGoBowl = function (x, y, holecolor) {
    var bowl = paper.ellipse(x, y + 8, 28, 20)
                    .attr({stroke: 'none',
                           fill: 'brown'});
    var hole = paper.ellipse(x, y, 20, 10)
                    .attr({stroke: 'none',
                           fill: holecolor});
    return paper.set().push(bowl, hole);
  };

  var whiteBowlX = 532;
  var whiteBowlY = 20;
  var blackBowlX = 532;
  var blackBowlY = 270;

  whiteBowl = createGoBowl(whiteBowlX, whiteBowlY, 'white');
  blackBowl = createGoBowl(blackBowlX, blackBowlY, 'gray');

  whiteBowl.click(function () {
    Meteor.call('addPiece','white', whiteBowlX, whiteBowlY, Session.get('player_id'));
  });
  blackBowl.click(function () {
    Meteor.call('addPiece','black', blackBowlX, blackBowlY, Session.get('player_id'));
  });
}



