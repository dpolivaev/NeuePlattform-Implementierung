'use strict';

var _ = require('lodash');
var WaitinglistEntry = require('simple-configure').get('beans').get('waitinglistEntry');

function Rooms(roomsObject, allKnownMemberIds) {
  this.state = roomsObject; // this must be *the* object that is referenced by resource.rooms
  this.allKnownMemberIds = allKnownMemberIds;
  return this;
}

Rooms.prototype.add = function (memberId1, memberId2) {
  var participantsInRoom = this.participantsInRoom();
  var bothAreKnown = this.allKnownMemberIds.indexOf(memberId1) > -1 && this.allKnownMemberIds.indexOf(memberId2) > -1;
  var bothAreNotInARoom = participantsInRoom.indexOf(memberId1) === -1 && participantsInRoom.indexOf(memberId2) === -1;
  var theyAreDifferent = memberId1 !== memberId2;

  if (bothAreKnown && bothAreNotInARoom && theyAreDifferent) {
    this.state.push({participant1: memberId1, participant2: memberId2});
  }
};

Rooms.prototype.participantsInRoom = function () {
  var participantsInRoom = [];
  participantsInRoom.push(_.pluck(this.state, 'participant1'));
  participantsInRoom.push(_.pluck(this.state, 'participant2'));
  return _.flatten(participantsInRoom);
};

Rooms.prototype.roomPairsWithMembersFrom = function (memberList) {
  return _.map(this.state, function (roomPair) {
    return {
      participant1: _.find(memberList, function (member) { return member.id() === roomPair.participant1; }),
      participant2: _.find(memberList, function (member) { return member.id() === roomPair.participant2; })
    };
  });
};

Rooms.prototype.participantsWithoutRoom = function () {
  var participantsInRoom = this.participantsInRoom();
  return _.filter(this.allKnownMemberIds, function (memberId) {return participantsInRoom.indexOf(memberId) === -1; });
};

module.exports = Rooms;