import React, { Component } from 'react';
import { Alert, Progress, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import API from '../../api'

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
        console.log("UserInfo: ", userInfo)
        if(userInfo.publicIP){
            this.setState({isLocalAgentOnline: true})
        } else {
            this.setState({isLocalAgentOnline: false})
        }
    }

    async componentDidMount() {
        await this.loadSystems()
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
        return (!this.state.isLocalAgentOnline) ? (<Alert color="danger">Your network is unsafe! Offensive Mamba is not running in you Network.</Alert>) : (this.state.currentSystem === null) ? null : (
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
                <Alert color="primary">
                    <>{this.state.currentSystem}</>
                    <Progress color="success" value="25" >Exploiting . . .</Progress>
                    <>Executing linux/http/apache_continuum_cmd_exec (linux/x86/chmod)</>
                </Alert>

            </>
        )

    }
}

export default RuntimeStatus;