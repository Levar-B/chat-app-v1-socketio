import React from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const socket = io.connect(`http://localhost:3000/`, {
	auth: { token: 'levar' },
});

const Chat = () => {
	const { state } = useLocation();
	const { name, color, room } = state;

	const [message, setMessage] = React.useState('');
	const [changeRoom, setChangeRoom] = React.useState(room);
	const [chat, setChat] = React.useState([]);

	const joinRoom = () => {
		socket.emit('join room', changeRoom);
	};

	const handleChange = (prop) => (event) => {
		switch (prop) {
			case 'Room':
				setChangeRoom(event.target.value);
				joinRoom();
				break;
			case 'Message':
				setMessage(event.target.value);
				break;
		}
	};

	joinRoom();

	const handleSubmit = (event) => {
		event.preventDefault();
		socket.emit('chat message', {
			name,
			col: color,
			message,
			room: changeRoom,
			time: Date.now(),
		}) && setMessage('');
	};

	const renderChat = () => {
		return chat.map(({ name: myName, col, message, time }, idx) => (
			<li key={idx} id={myName === name ? 'me' : 'other'}>
				<div className="chat-container">
					<p id="chat-message" style={{ color: col }}>
						{message}
					</p>
					<div className="user-container">
						<img src="socketio.png" alt="" id="user-img" />
						<p id="chat-name" style={{ color: col }}>{`${myName}  `}</p>
					</div>
				</div>
				<p id="moments-ago">{moment(time).fromNow()}</p>
			</li>
		));
	};
	React.useEffect(() => {
		socket.on('chat message recieve', (data) => {
			const { name, col, message, room, time } = data;
			setChat([...chat, { name, col, message, room, time }]);
		});
	});
	React.useEffect(() => {
		window.scrollTo(0, document.body.scrollHeight);
	}, [chat]);

	return (
		<div id="live-chat">
			<ul id="messages">{renderChat()}</ul>
			<form id="form" onSubmit={handleSubmit}>
				<select
					name="rooms"
					id=""
					onChange={handleChange('Room')}
					defaultValue={changeRoom}
				>
					<option value={`room_1`}> room 1 </option>
					<option value={`room_2`}> room 2</option>
					<option value={`room_3`}> room 3 </option>
					<option value={`room_4`}> room 4 </option>
					<option value={`room_5`}> room 5 </option>
				</select>
				<input
					id="input"
					autoComplete="off"
					onChange={handleChange('Message')}
					value={message}
				/>
				<button type="submit"> Send </button>
			</form>
		</div>
	);
};

export default Chat;
