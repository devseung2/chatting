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
    case 419:
      errorMsg = "이미 존재하는 아이디입니다.";
      break;
    default:
      errorMsg = "잠시 후 다시 시도해주시기랍니다.";
      break;
  }
  return errorMsg;
};

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      pw: "",
      repw: ""
    };
  }

  onChangeId = e => {
    this.setState({ id: e.currentTarget.value });
  };

  onChangePw = e => {
    this.setState({ pw: e.currentTarget.value });
  };

  onChangeRePw = e => {
    this.setState({ repw: e.currentTarget.value });
  };

  signUp = () => {
    const { id, pw, repw } = this.state;
    if (!id || !pw) {
      alert("아이디나 비밀번호를 입력하지 않았습니다.");
    }
    else if(pw === repw) {
      axios.post("/api/users/signup", {id, pw})
        .then(({ data }) => {
          window.location.href = "/";
        })
        .catch(err => {
          alert(getErrorMsg(err.response.status));
        });
    }
    else {
      alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
    }
  };

  render() {
    return (
      <div className="Signup">
        <Container>
          <Row className="padding-top-btm-1">
            <Col>
              <span className="pageTitle">회원가입</span>
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
              />
            </Col>
          </Row>
          <Row className="padding-top-btm-1">
            <Col xs={{size : 8, offset : 2}} sm={{size : 8, offset : 2}} md={{size : 4, offset : 4}}>
              <Input
                type="password"
                name="password"
                id="inputRePW"
                placeholder="비밀번호 확인"
                onChange={this.onChangeRePw}
              />
            </Col>
          </Row>
          <Row className="padding-top-btm-1">
            <Col xs={{size : 4, offset : 2}} sm={{size : 4, offset : 2}} md={{size : 2, offset : 4}}>
              <Link to="/" className="CancelBtn">
                <Button color="secondary" size="lg" block>
                  <span className="font-bold-700">취소</span>
                </Button>
              </Link>
            </Col>
            <Col xs={{size : 4}} sm={{size : 4}} md={{size : 2}}>
              <Button color="success" onClick={this.signUp} size="lg" block>
                <span className="font-bold-700">확인</span>
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Signup;
