import React, { Component } from 'react';
import { Container, InputGroup, InputGroupAddon, Alert, InputGroupText, Row, Col, Button, Input, FormFeedback, CardHeader, Card, CardBody } from 'reactstrap';
import './ProfileSettings.css'
import API from '../../api'
class ProfileSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailaddress: "yourname@youcompany.com",
            firstname: "John",
            lastname: "Smith",
            companyname: "Your Awesome Company",
            newpass: "",
            confirmpass: "",
            updateInfo: {
                error: "",
                errors: {},
                message: ""
            },
            updatePass: {
                error: "",
                message: ""
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.updateInfo = this.updateInfo.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
    }

    async componentDidMount() {
        var userData = await API.getUserInfo()
        this.setState({
            emailaddress: userData.emailAddress,
            firstname: userData.firstname,
            lastname: userData.lastname,
            companyname: userData.companyName
        })

    }

    handleChange(e) {
        if (this.state[e.target.name] !== e.target.value) {
            var data = {}
            data[e.target.name] = e.target.value;
            this.setState(data)
        }
    }

    async updateInfo() {
        var { firstname, lastname, companyname } = this.state
        var responseJSON = await API.updateUserInfo(firstname, lastname, companyname)
        var updateInfo = this.state.updateInfo
        if (responseJSON.success) {
            updateInfo.message = responseJSON.message
            updateInfo.error = ""
            updateInfo.errors = {}
            this.setState({ updateInfo: updateInfo })
            setTimeout(() => {
                var updateInfo = this.state.updateInfo
                updateInfo.message = ""
                updateInfo.error = ""
                updateInfo.errors = {}
                this.setState({ updateInfo: updateInfo })
            }, 2000)
        } else if (responseJSON.error) {
            updateInfo.message = ""
            updateInfo.error = responseJSON.error
            updateInfo.errors = {}
            this.setState({ updateInfo: updateInfo })
        } else if (responseJSON.errors) {
            updateInfo.message = ""
            updateInfo.error = ""
            updateInfo.errors = responseJSON.errors
            this.setState({ updateInfo: updateInfo })
        }
    }

    async updatePassword() {
        var { newpass, confirmpass } = this.state
        var responseJSON = await API.updatePass(newpass, confirmpass)
        var result = this.state.updatePass
        if (responseJSON.success) {
            result.error = ""
            result.message = responseJSON.message
            this.setState({updatePass: result})
        } else {
            result.error = responseJSON.error
            result.message = ""
            this.setState({updatePass: result})
        }
    }

    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col>
                        <h1 className="border-bottom">Profile Settings</h1>
                        <div><small>Update your profile information</small></div>
                    </Col>
                </Row>
                <Container className="main">
                    {
                        (this.state.updateInfo.message == "") ? null : <Row><Col sm="6"><Alert color="success">{this.state.updateInfo.message}</Alert></Col></Row>
                    }
                    {
                        (this.state.updateInfo.error == "") ? null : <Row><Col sm="6"><Alert color="danger">{this.state.updateInfo.error}</Alert></Col></Row>
                    }
                    <Row>
                        <Col sm="6">
                            <Card>
                                <CardHeader>General Information</CardHeader>
                                <CardBody>

                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>First Name</InputGroupText>
                                        </InputGroupAddon>
                                        <Input name="firstname" id="firstname" placeholder="John" value={this.state.firstname} onChange={this.handleChange}
                                            // valid={this.state.firstname.trim() !== "" && !this.state.updateInfo.errors.firstname }
                                            invalid={!!this.state.updateInfo.errors.firstname}
                                        />
                                        <FormFeedback invalid={"true"}>{(this.state.updateInfo.errors.firstname) ? (this.state.updateInfo.errors.firstname) : null}</FormFeedback>
                                    </InputGroup>
                                    <br />
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>Last Name</InputGroupText>
                                        </InputGroupAddon>
                                        <Input name="lastname" id="lastname" placeholder="Smith" value={this.state.lastname} onChange={this.handleChange}
                                            // valid={this.state.lastname.trim() !== "" && !this.state.updateInfo.errors.lastname }
                                            invalid={!!this.state.updateInfo.errors.lastname}
                                        />
                                        <FormFeedback invalid={"true"}>{(this.state.updateInfo.errors.lastname) ? (this.state.updateInfo.errors.lastname) : null}</FormFeedback>
                                    </InputGroup>
                                    <br />
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>Company Name</InputGroupText>
                                        </InputGroupAddon>
                                        <Input name="companyname" id="compnayname" placeholder="Your Awesome Company" value={this.state.companyname} onChange={this.handleChange}
                                            // valid={this.state.lastname.trim() !== "" && !this.state.updateInfo.errors.companyname }
                                            invalid={!!this.state.updateInfo.errors.companyname}
                                        />
                                        <FormFeedback invalid={"true"}>{(this.state.updateInfo.errors.companyname) ? (this.state.updateInfo.errors.companyname) : null}</FormFeedback>
                                    </InputGroup>
                                    <br />
                                    <Row>
                                        <Col>
                                            <Button className="float-right" onClick={() => this.updateInfo}>Save</Button>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>

                        </Col>
                        <Col sm="6">
                            <Card className="d-none">
                                <CardHeader>Change Email Address</CardHeader>
                                <CardBody>
                                    <strong>Current Address: </strong>{this.state.emailaddress}
                                    <br />
                                    <InputGroup>
                                        <Input placeholder="Enter new email address" name="newemail" id="newemail" type="email" invalid={false} />
                                        <FormFeedback invalid>Invalid Name</FormFeedback>
                                    </InputGroup>
                                    <br />
                                    <Row>
                                        <Col>
                                            <Button className="float-right">Save</Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col sm={{ size: 6 }}>
                            <Card>
                                <CardHeader>Change Password</CardHeader>
                                <CardBody>
                                    {
                                        (this.state.updatePass.error == "") ? null : <Alert color="danger">{this.state.updatePass.error}</Alert> 
                                    }
                                    {
                                        (this.state.updatePass.message == "") ? null : <Alert color="success">{this.state.updatePass.message}</Alert> 
                                    }
                                    <InputGroup>
                                        <Input placeholder="New Password" type="password" name="newpass" onChange={this.handleChange}
                                        />
                                    </InputGroup>
                                    <br />
                                    <InputGroup>
                                        <Input placeholder="Confirm New Password" type="password" name="confirmpass"  onChange={this.handleChange}/>
                                    </InputGroup>
                                    <br />
                                    <Row>
                                        <Col>
                                            <Button className="float-right" onClick={() => this.updatePassword()}>Update</Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Container>
        )

    }
}

export default ProfileSettings