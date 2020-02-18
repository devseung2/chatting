import React from "react";
import { Row, Col, Toast, ToastBody } from "reactstrap";
import moment from "moment";
import "./style.scss";

const ChatListGroup = ({ chatList, whisperOpen, userId }) => {
    const messages = chatList.map((chat, index) => {
        const replaceMsg = chat.msg.split('\n').map( (content, index) => {
            return (
                <span key={index}>{content}<br/></span>
            )
        });
    
        const date = moment(chat.date).format('YYYY-MM-DD A hh:mm');
        if(chat.id == userId){
            return(
                <Row key={index} >
                    <Col xs={{ size : 6, offset : 6}} sm={{ size : 6, offset : 6}} md={{ size : 6, offset : 6}} >
                        <Toast className="msg">
                            <ToastBody className="myMsgContent">
                                {replaceMsg}
                            </ToastBody>
                        </Toast>
                        <div className="msgDate">{date}</div>
                    </Col>
                </Row>
            )
        }
        else {
            return(
                <Row key={index} >
                    <Col xs={{ size : 6}} sm={{ size : 6 }} md={{ size : 6 }}>
                        <div>
                            <span onClick={whisperOpen} className="msgUserId">{chat.id}</span>
                        </div>
                        <Toast className="msg">
                            <ToastBody className="msgContent">
                                {replaceMsg}
                            </ToastBody>
                        </Toast>
                        <div>
                            <div></div>
                        </div>
                        <div className="msgDate">{date}</div>
                    </Col>
                </Row>
            )
        }
    })

    return (
        <React.Fragment>
            { messages }
        </React.Fragment>
    );
}

export default ChatListGroup;