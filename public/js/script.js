// const socket = io();

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition(
//         (position)=>{
//         const { latitude , longitude } = position.coords;
//         socket.emit("send-location",{ latitude , longitude });
//     },
//     (error)=>{
//         console.error(error);
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//     }
//     );
// }

// const map = L.map("map").setView([0, 0], 16);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Some-One-Is-Watching-You"
// }).addTo(map);

// const markers ={};

// socket.on("receive-location",(data)=>{
//     const{id , latitude , longitude } = data;
//     map.setView( [latitude , longitude ],16);
//     if (markers[id]){
//         markers[id].setLatLng([latitude,longitude]);
//     }else{
//         markers[id]=L.marker([latitude,longitude]).addTo(map);
//     }
// });

// socket.on("user-disconnected",(id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// });
const socket = io();
let mySocketId = null;

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Some-One-Is-Watching-You"
}).addTo(map);

const markers = {};

socket.on("connect", () => {
    mySocketId = socket.id;
    console.log("My socket ID:", mySocketId);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (id === mySocketId) {
        map.setView([latitude, longitude], 16);
    }

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (id !== mySocketId && markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

