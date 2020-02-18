import React from "react";
import { Form, FormGroup, Input, Button, InputGroup, InputGroupAddon } from "reactstrap";
import "./style.scss";

const ChatBtmGroup = ({ messageChange, enterSend, message, send }) => (
	<React.Fragment>
        <Form>
            <FormGroup>
                <InputGroup>
                    <Input type="textarea" onChange={messageChange} onKeyDown={enterSend} value={message} className="inputMsg" />
                    <InputGroupAddon addonType="append">
                      <Button color="primary" onClick={send} className="inputMsgBtn">전송</Button>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
        </Form>
	</React.Fragment>
);

export default ChatBtmGroup;