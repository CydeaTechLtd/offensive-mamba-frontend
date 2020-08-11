import React, { Component } from 'react';

class Home extends Component {
    render() {
        return <>
            <div class="container">
                {/* <div class="row text-center justify-content-center"> */}
                    <h1 className="text-center">Offensive Mamba</h1>
                {/* </div> */}
                <div>
                    <h2>Developed By:</h2>
                    <ul>
                        <li>
                            Muhammad Tayyab Sheikh [FA16-BCS-044]
                </li>
                        <li>
                            Majid Khan Burki FA16-BCS-009]
                </li>
                    </ul>
                </div>
                <div>
                    <h2>Supervised By:</h2>
                    <ul>
                        <li>Dr. Muhammad Masoom Alam</li>
                    </ul>
                </div>
            </div>
        </>
    }
}

export default Home