import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap'
import Code from 'react-code-prettify';
import API from '../../api'
class ExploreCVE extends Component {
    constructor(props) {
        super(props)
        if (props.match == undefined || props.match == null || props.match.params[0] == undefined || props.match.params === {} || props.match.params[0] === "") {
            this.state = { cve: null, loading: false }
        } else {
            this.state = { cve: props.match.params[0].toUpperCase(), loading: true, vulnersInfo: null }
        }
    }
    async componentDidMount() {
        if (this.state.cve != null || this.state.cve != "") {
            var response = await API.searchVulnersByID(this.state.cve)
            if (response.id !== undefined) {
                this.setState({ vulnersInfo: response, loading: false })
            }
        }
    }

    render() {

        return (this.state.cve == null) ? <><h1>CVE Explorer</h1>Here you can view Common Vulnerability &amp; Exposure(CVE) details. Whenenver you click a CVE ID or url inside Offensive Mamba, it will open here.</> : (this.state.loading) ? <></> : (
            <Container fluid={true} >
                <Row>
                    <Col xs="2">
                        {(this.state.vulnersInfo.id.startsWith("CVE-") ? <img src="/images/cvebanner.png" style={{width: '128px', height: 'auto'}} alt="CVE Icon" /> : null)}
                    </Col>
                    <Col xs="10">
                        <Row><h2>{this.state.vulnersInfo.title}</h2></Row>
                        <Row>{this.state.vulnersInfo.id}</Row>
                        <Row>{new Date(this.state.vulnersInfo.modified).toLocaleDateString()}</Row>
                    </Col>
                </Row>
                <Row><Col xs="12"><h3>Description</h3></Col></Row>
                <Row><Col xs="12">{this.state.vulnersInfo.description}</Col></Row>

                <Row>
                    <Col xs="12"><h3>Severity</h3></Col>

                </Row>
                <Row>
                    <Col xs="12">{this.state.vulnersInfo.cvss.score}</Col>
                </Row>
            </Container>)
    }
}

export default ExploreCVE