import React, { Component } from 'react';
import { Alert, Progress, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import API from '../../api'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import io from "socket.io-client";
import ReactAnimatedEllipsis from 'react-animated-ellipsis'

class RuntimeStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            systemsData: {},
            totalSystems: 0,
            upCount: 0,
            osCount: {},
            currentSystem: null,
            systemStatuses: {},
            isLocalAgentOnline: false
        }
        this.loadSystems = this.loadSystems.bind(this)
        this.isLocalAgentOnline = this.isLocalAgentOnline.bind(this)
    }

    async isLocalAgentOnline() {
        const userInfo = await API.getUserInfo();
        if (userInfo.publicIP) {
            this.setState({ isLocalAgentOnline: true })
        } else {
            this.setState({ isLocalAgentOnline: false })
        }
    }

    async componentDidMount() {
        await this.isLocalAgentOnline()
        await this.loadSystems()
        const userInfo = await API.getUserInfo();
        if (this.state.isLocalAgentOnline) {
            const socket = io("115.186.176.141:8080", {
                transports: ['polling'],
                upgrade: false,
                secure: false,
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            'Authorization': 'Bearer ' + localStorage.getItem("userToken")
                        }
                    }
                },
                query: "request=subscribe"
            });
            socket.on("connect", () => {
                console.log("Connected")
            })
            socket.on("statusUpdate", (data) => {
                var systemStatuses = this.state.systemStatuses
                systemStatuses[data.system] = data
                this.setState({ systemStatuses: systemStatuses })
            })
            socket.connect()
        }
    }

    async loadSystems() {
        this.setState({ 'isLoading': true, currentSystem: null })
        var response = await API.getAllLocalSystems()
        if (response.success) {
            var systems = response.data
            var systemsInfo = {}
            var upCount = 0
            var osCount = {}
            var currentSystem = null;
            if (systems.length > 0) {
                currentSystem = systems[0]
            }
            for (var ipaddress of systems) {
                response = await API.getLocalSystemStatus(ipaddress)
                console.log(response)
                if (response.success === false) {
                    systemsInfo[ipaddress] = null
                } else {
                    var data = response.data
                    systemsInfo[ipaddress] = data
                    if (data.up === true) {
                        upCount += 1
                    }
                    if (osCount[data.os]) {
                        osCount[data.os]++
                    } else {
                        osCount[data.os] = 1
                    }
                }
            }
            this.setState({ error: "", systemsData: systemsInfo, totalSystems: systems.length, upCount: upCount, osCount: osCount, isLoading: false, currentSystem: currentSystem })
        } else {
            this.setState({ error: response.error, isLoading: false })
            return null
        }
    }

    render() {
        var currentSys = this.state.systemStatuses[this.state.currentSystem] ? this.state.systemStatuses[this.state.currentSystem] : null
        return (!this.state.isLocalAgentOnline) ? (<Alert color="danger"><FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon> <span style={{ fontWeight: "bolder" }}>Your network is unsafe!</span> Offensive Mamba is not running in your Network.</Alert>) : (this.state.currentSystem === null) ? null : (
            <>
                <div className="clearfix pb-2">
                    <UncontrolledDropdown className="float-right">
                        <DropdownToggle caret style={{ width: "auto" }}>
                            Change Local System
                        </DropdownToggle>
                        {this.state.isLoading ? <DropdownMenu><DropdownItem disabled>Loading . . .</DropdownItem></DropdownMenu> : (
                            <DropdownMenu right>
                                {
                                    Object.keys(this.state.systemsData).map((ipaddress, i) => {
                                        return (<DropdownItem >{ipaddress}</DropdownItem>)
                                    })
                                }

                            </DropdownMenu>
                        )}
                    </UncontrolledDropdown>
                </div>
                {
                    currentSys ?

                        <Alert color="primary">
                            <><span style={{ fontWeight: "bolder" }}>Local System IP: </span>{this.state.currentSystem}</>
                            {currentSys.progress ? <Progress color="success" value={currentSys.progress.value} >{currentSys.progress.text}</Progress> : null}
                            <p>{currentSys.statusText}<ReactAnimatedEllipsis fontSize="1rem" /></p>
                        </Alert> : <Alert color="primary">Waiting for status from {this.state.currentSystem}<ReactAnimatedEllipsis fontSize="1rem"/></Alert>
                }

            </>
        )

    }
}

export default RuntimeStatus;