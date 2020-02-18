import React from "react";
import { Col, Card, CardBody, Container } from "reactstrap";
import axios from "axios";
import socketio from "socket.io-client";
import ChatTitleGroup from "../../../../components/chatTitleGroup";
import ChatListGroup from "../../../../components/chatListGroup";
import ChatBtmGroup from "../../../../components/chatBtmGroup";
import "./style.scss";

const socket = socketio();

class Chatting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message : '',			// 전송할 메시지
			chatList : [],			// 메시지 리스트
			userId : '',			// 유저 아이디
			userList : [],			// 접속한 유저 리스트
			dropdownOpen : false,	// 접속자 리스트 버튼
			receiver : ''			// 귓속말 수신자
		}

		this.scroll = React.createRef();
	}

	componentDidMount(){
		this.getUserId();
		this.getAllMsgList();
		
		// 전체 채팅 가져오기
		socket.on('receive', (data) => {
			const receiver = this.state.receiver;
			const userID = this.state.userId;

			// 전체 채팅
			if(receiver === "" && data.channel === "channel") {
				this.setState({ chatList: this.state.chatList.concat([data]) });
			}
			// 귓속말 채팅 (상대방 전송)
			else if(receiver == data.id && userID == data.channel) {
				this.setState({ chatList: this.state.chatList.concat([data]) });
			}
			// 귓속말 채팅 (나에게 전송)
			else if(userID == data.id){
				this.setState({ chatList: this.state.chatList.concat([data]) });
			}

			this.scrollToBottom();
		});

		// 전체 사용자 정보 얻기
		socket.on('receiveUserList', (data) => {
			this.setState({ userList : data });
		});
	}

	// 유저 아이디 정보 얻기
	getUserId = () => {
		axios.get('/api/users/id')
		.then(({ data }) => {
			if(data){
                this.setState({ userId : data });
            }
            else{
                window.location.href = "/";
            }
			socket.emit('channel', this.state.userId);
		});
	}

	// 모든 사람들의 메시지 얻기
	getAllMsgList = () => {
		axios.get('/api/chats/messages', {params : {channel : "channel"} })
		.then(({ data }) => {
			this.setState({ chatList : data });
			this.scrollToBottom();
		})
		.catch(err => {
			console.log(err);
		});
	}

	// 선택한 상대방과의 귓속말 메시지 얻기
	getWhisperMsgList = (receiverId) => {
		axios.get('/api/whispers/messages', {params : { id : this.state.userId, receiver : receiverId }})
		.then(({ data }) => {
			this.setState({ chatList : data });
			this.scrollToBottom();
		})
		.catch(err => {
			console.log(err);
		});
	}

	// 스크롤 설정
	scrollToBottom = () => {
		const scroll = this.refs.scroll;
		scroll.scrollTop = scroll.scrollHeight;
	}

	// 사용자 인원 클릭
	toggle = () => {
		this.setState({dropdownOpen : !this.state.dropdownOpen});
	}
	
	// 귓속말 대화창 열기
	whisperOpen = (e) => {
		const receiverId = e.target.innerText;
		this.setState({ receiver : receiverId, chatList : [] });
		this.getWhisperMsgList(receiverId);
	}

	// 귓속말 대화창 닫기
	whisperClose = () => {
		this.setState({ receiver : "", chatList : [] });
		this.getAllMsgList();
	}
	
	// 채팅 메시지 input 내용 변경
	messageChange = (e) => {
		this.setState({ message : e.target.value });
	}

	// 채팅 메시지 input 엔터키
	enterSend = (e) => {
        if(e.keyCode === 13) {
			if (!e.shiftKey){
            	e.preventDefault();
            	this.send();
			}
        }
    }
	
	// 전체 채팅 메시지 보내기
	sendAll = (sendInfo) => {
		axios.post('/api/chats/send', { sendInfo : sendInfo })
		.then(({ data }) => {
			socket.emit('send', sendInfo );
		})
		.catch(err => {
			console.log(err);
		});
	}

	// 귓속말 메시지 보내기
	sendWhisper = (sendInfo) => {
		axios.post('/api/chats/send', { sendInfo : sendInfo })
		.then(({ data }) => {
			socket.emit('whisperSend', sendInfo );
		})
		.catch(err => {
			console.log(err);
		});
	}

	// 채팅 메시지 전송
	send = () => {
		if(!this.state.message){
			alert("메시지를 입력하세요.");
		}
		else{
			// 전체 채널 메시지 전송
			if(!this.state.receiver){
				const sendInfo = { msg : this.state.message, id : this.state.userId, channel : "channel" };
				this.sendAll(sendInfo);
			}
			// 귓속말 메시지 전송
			else {
				const sendInfo = { msg : this.state.message, id : this.state.userId, channel : this.state.receiver };
				this.sendWhisper(sendInfo);
			}

			this.setState({ message : '' });
		}
	}
	
	render() {
		const { chatList, userList } = this.state;
		return (
			<div>
				<Container>
					<Col xs={{size : 12}} sm={{size : 10, offset : 1}} md={{ size: 6, offset: 3 }} >
						<Card className="chat" >
							<CardBody className="chatTitle" >
								<ChatTitleGroup userList={userList} dropdownOpen={this.state.dropdownOpen} toggle={this.toggle} whisperOpen={this.whisperOpen} whisperClose={this.whisperClose} receiver={this.state.receiver}/>
							</CardBody>
							<div ref="scroll" className="chatBody">
								<CardBody>
									<ChatListGroup chatList={chatList} whisperOpen={this.whisperOpen} userId={this.state.userId} />
								</CardBody>
							</div>
							<CardBody className="chatBtm">
								<ChatBtmGroup messageChange={this.messageChange} enterSend={this.enterSend} message={this.state.message} send={this.send}/>
							</CardBody>
						</Card>
					</Col>
				</Container>
			</div>
		);
	}
}
	
export default Chatting;