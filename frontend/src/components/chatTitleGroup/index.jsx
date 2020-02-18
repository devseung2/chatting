import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./style.scss";

const ExitBtn = (receiver, whisperClose) => {
    if(receiver){
        return (
            <Button className="exitBtn" color="secondary" size="sm" onClick={whisperClose}><span>나가기</span></Button>
        )
    }
}

const UserList = (receiver, userList, dropdownOpen, toggle, whisperOpen) => {
    if(receiver){
        return (<span className="receiver">{receiver}</span>)
    }
    else {
        return (
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle color="link" className="userId">
                    <FontAwesomeIcon icon={faUser} className="icon-size" /> <span>{userList.length}</span>
                </DropdownToggle>
                <DropdownMenu modifiers={{ setMaxHeight: {enabled: true, order: 890, fn: (data) => { return { ...data, styles: { ...data.styles, overflow: 'auto', maxHeight: '100px', }, };},},}} >
                {
                    userList.map((user, index) => {
                        return (
                            <DropdownItem key={index} onClick={whisperOpen}>{user.id}</DropdownItem>
                        )
                    })
                }
                </DropdownMenu>
            </Dropdown>
        )
    }
}

const ChatName = (receiver) => {
    if(receiver){
        return (<span>귓속말</span>)
    }
    else {
        return (<span>전체 채팅</span>)
    }
}

const ChatTitleGroup = ({ userList, dropdownOpen, toggle, whisperOpen, whisperClose, receiver }) => (
    <React.Fragment>
        <div className="chatName">
            {ChatName(receiver)}
            {ExitBtn(receiver, whisperClose)}
        </div>
        {UserList(receiver, userList, dropdownOpen, toggle, whisperOpen)}
    </React.Fragment>
);

export default ChatTitleGroup;