import React from "react";
import { Link } from "react-router-dom";
import { Button, Input, Container, Row, Col } from "reactstrap";
import "./style.scss";
import axios from "axios";

const getErrorMsg = errCode => {
  let errorMsg;
  switch (errCode) {
    case 400:
      errorMsg = "잘못된 요청입니다.";
      break;
    case 420:
      errorMsg = "잘못된 아이디나 패스워드입니다.";
      break;
    default:
      errorMsg = "잠시 후 다시 시도해주시기랍니다.";
      break;
  }
  return errorMsg;
};

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      pw: ""
    };
  }

  onChangeId = e => {
    this.setState({ id: e.currentTarget.value });
  };

  onChangePw = e => {
    this.setState({ pw: e.currentTarget.value });
  };

  signIn = () => {
    const { id, pw } = this.state;
    if (!id || !pw) {
      alert("아이디나 비밀번호를 입력하지 않았습니다.");
    }
    else{
      axios.post("/api/users/signin", { id, pw })
      .then(({ data }) => {
        window.location.href = "/chat";
      })
      .catch(err => {
        alert(getErrorMsg(err.response.status));
      });
    }
  };

	enterSend = (e) => {
    if(e.keyCode === 13) {
      if (!e.shiftKey){
        e.preventDefault();
        this.signIn();
      }
    }
  }

  render() {
    return (
      <div className="Signin">
        <Container>
          <Row className="padding-top-btm-1">
            <Col>
              <span className="pageTitle">로그인</span>
            </Col>
          </Row>
          <Row className="padding-top-btm-1">
            <Col xs={{size : 8, offset : 2}} sm={{size : 8, offset : 2}} md={{size : 4, offset : 4}}>
              <Input
                type="text"
                name="id"
                id="inputId"
                placeholder="아이디"
                onChange={this.onChangeId}
              />
            </Col>
          </Row>
          <Row className="padding-top-btm-1">
            <Col xs={{size : 8, offset : 2}} sm={{size : 8, offset : 2}} md={{size : 4, offset : 4}}>
              <Input
                type="password"
                name="password"
                id="inputPW"
                placeholder="비밀번호"
                onChange={this.onChangePw}
                onKeyDown={this.enterSend}
              />
            </Col>
          </Row>
          <Row className="padding-top-btm-1">
            <Col xs={{size : 8, offset : 2}} sm={{size : 8, offset : 2}} md={{size : 4, offset : 4}}>
              <Button color="success" onClick={this.signIn} size="lg" block>
                <span className="font-bold-700">로그인</span>
              </Button>
              </Col>
          </Row>
          <Row className="padding-top-1">
            <Col xs={{size : 8, offset : 2}} sm={{size : 8, offset : 2}} md={{size : 4, offset : 4}}>
              <Link to="/signup" className="signupBtn font-color-black">
                <span className="font-bold-700">회원가입</span>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Signin;
