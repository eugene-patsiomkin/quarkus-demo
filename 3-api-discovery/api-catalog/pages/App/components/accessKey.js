import React, {Component} from "react"
 
const getKeyStyle = "border-1 border-gray-300 bg-white h-10 px-2 mr-2 rounded-md text-sm focus:outline-none";
const getKeyBtnStyle = "button bg-blue-600 text-white font-bold mx-2 px-3 h-10 rounded-md border border-blue-700 text-sm hover:bg-blue-500";

class AccessKey extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    };

    async getAPIKey() {
        console.log(this.state);
        const res = await fetch(`/api/authkey`, {
            method: "POST",
            body: JSON.stringify({
                customer_id: this.state.customer_id,
                route_id: this.state.route_id,
                key_duration: this.state.key_duration
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        const data = await res.json();

        if (data.key) {
            this.setState( state => {
                return {... state, status: `You have been added to API security group you can use "${data.key}" to access it.`}
            })
        } else {
            this.setState( state => {
                return {... state, status: `Can not add you to security group. Server response ${JSON.stringify(data)}`}
            })
        }
    }

    setCustomerId(txt) {
        this.setState( state => {
            return {... state, customer_id: txt}
        })
    }

    setKeyDuration(txt) {
        this.setState( state => {
            return {... state, key_duration: txt}
        })
    }

    render () {
        return (
            <section>
                <header className="font-bold mb-1">Get your API key</header>
                <select className={getKeyStyle} name="key_duration" onChange={e=>this.setKeyDuration(e.target.value)}>
                    <option value="86400">One Day</option>
                    <option value="259200">Tree Days</option>
                    <option value="432000">Five Days</option>
                    <option value="432000">Five Days</option>
                    <option value="604800">One Week</option>
                    <option value="2678400">One Month</option>
                </select>
                <input className={getKeyStyle} type="text" name="customer_id" placeholder="Customer ID" onChange={e=>this.setCustomerId(e.target.value)}/>
                <button className={getKeyBtnStyle} onClick={e=>this.getAPIKey()}>Get key</button>
                <span className="ml-4">{this.state.status || ""}</span>
            </section>
        );
    };
}

class RequestAccess extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    };

    render () {
        return (
            <a href="mailto:santa@northpole.com" target="_blank" className="link underline text-blue-500">Request Access</a>
        );
    };
}
export {AccessKey, RequestAccess};

export default AccessKey;