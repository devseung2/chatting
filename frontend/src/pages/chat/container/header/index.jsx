import React from "react";
import axios from "axios";
import "./style.scss";
import { Navbar, NavbarBrand, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId : '',
            dropdownOpen : false
        };
    }

    componentDidMount() {
        axios.get("/api/users/id")
        .then(({ data }) => {
            if(data){
                this.setState({ userId : data });
            }
            else{
                window.location.href = "/";
            }
        })
    }

    toggle = () => {
        this.setState({ dropdownOpen : !this.state.dropdownOpen });
    }

    signOut = () => {
        axios.get("/api/users/signout")
        .then(({ data }) => {
            window.location.href = "/";
        })   
    }

    render() {
        const { userId, dropdownOpen } = this.state;
        return (
            <div>
                <Navbar color="light" light fixed="top">
                    <NavbarBrand href="/chat" className="Title">Chatting</NavbarBrand>
                    <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                            <FontAwesomeIcon icon={faUser} />
                        </DropdownToggle>
                        <DropdownMenu right className="DropdownBtn">
                            <DropdownItem header>
                                <span className="UserId">{userId}</span>
                            </DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>
                                <Button onClick={this.signOut}>
                                    <span className="font-bold-700">로그아웃</span>
                                </Button>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Navbar>
            </div>
        );
    }
}

export default Header;