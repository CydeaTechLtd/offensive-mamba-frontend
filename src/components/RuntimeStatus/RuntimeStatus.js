import React, { Component } from 'react';
import { Alert, Progress, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

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
                <div className="bg-info clearfix" style={{ padding: '.5rem' }}>
                    <UncontrolledDropdown className="float-right">
                        <DropdownToggle caret>
                            Change Local System
                        </DropdownToggle>
                        {this.state.isLoading ? null : (
                            <DropdownMenu>
                                {
                                    Object.keys(this.state.systemsData).map((ipaddress, i) => {
                                        const data = this.state.systemsData[ipaddress];
                                        return (<DropdownItem {... (data.up === true) ? null : "disabled"}></DropdownItem>)
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