import React, { Component } from 'react';
import { Alert, Progress, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import API from '../../api'

class RuntimeStatus extends Component {
    constructor(props) {
        super(props)
        this.state = { isLoading: true, error: null, systemsData: {}, totalSystems: 0, upCount: 0, osCount: {} }
        this.loadSystems = this.loadSystems.bind(this)
    }

    async componentDidMount() {
        await this.loadSystems()
    }

    async loadSystems() {
        this.setState({ 'isLoading': true })
        var response = await API.getAllLocalSystems()
        if (response.success) {
            var systems = response.data
            var systemsInfo = {}
            var upCount = 0
            var osCount = {}
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
            this.setState({ error: "", systemsData: systemsInfo, totalSystems: systems.length, upCount: upCount, osCount: osCount, isLoading: false })
        } else {
            this.setState({ error: response.error, isLoading: false })
            return null
        }
    }

    render() {
        return (
            <>
                <div className="clearfix">
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
                    <Progress color="success" value="25" ></Progress>
                </Alert>
            </>
        )
    }
}

export default RuntimeStatus;