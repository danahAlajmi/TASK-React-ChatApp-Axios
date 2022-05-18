import { makeObservable, observable, action } from "mobx";
import slugify from "react-slugify";
import axios from "axios";

class RoomStore {
  rooms = [
    {
      image:
        "https://mk0peerspaceres622pi.kinstacdn.com/wp-content/uploads/Eco-Friendly-Executive-Boardroom-santa-monica-la-los-angeles-rental-1200x600.jpg",
      id: 1,
      title: "Meeting room",
      description: "Only people invited for the meeting!",
      slug: "meeting-room",
      messages: [
        {
          msg: "Hi Hacker, How are you?",
        },
        {
          msg: "I am fine.",
        },
      ],
    },
  ];

  constructor() {
    makeObservable(this, {
      rooms: observable,
      createRoom: action,
      updateRoom: action,
      deleteRoom: action,
      createMsg: action,
    });
  }

  createRoom = async (room) => {
    room.id = this.rooms[this.rooms.length - 1].id + 1;
    room.slug = slugify(room.title);
    this.rooms.push(room);
    try {
      const response = await axios.post(
        "https://coded-task-axios-be.herokuapp.com/rooms",
        room
      );

      console.log(response);
    } catch (error) {
      console.error("i am create", error);
    }
  };

  deleteRoom = async (roomId) => {
    try {
      this.rooms = this.rooms.filter((room) => room.id !== roomId);
      const response = await axios.delete(
        `https://coded-task-axios-be.herokuapp.com/rooms/${roomId}`
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  createMsg = (roomId, msg) => {
    const room = this.rooms.find((_room) => _room.id === +roomId);
    room.messages.push(msg);
  };

  updateRoom = async (updatedRoom) => {
    try {
      const room = this.rooms.find((room) => room.id === updatedRoom.id);
      room.title = updatedRoom.title;
      room.description = updatedRoom.description;
      room.image = updatedRoom.image;
      let response = await axios.put(
        `https://coded-task-axios-be.herokuapp.com/rooms/${updatedRoom.id}`,
        updatedRoom
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  fetchRooms = async () => {
    try {
      const rooms = await axios.get(
        "https://coded-task-axios-be.herokuapp.com/rooms"
      );
      this.rooms = rooms.data;

      console.log(rooms.data);
    } catch (error) {
      console.error(error);
    }
  };
}

const roomStore = new RoomStore();
roomStore.fetchRooms();
export default roomStore;
