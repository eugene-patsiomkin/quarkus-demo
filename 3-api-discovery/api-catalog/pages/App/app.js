import React, {Component} from "react"
import Service from './components/services/service'

const searchStyle = "border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none";

class Home extends Component {
    constructor (props) {
        super(props);

        this.state = {
            services: props.services || [],
            filter: ""
        }
    }

    filterServiceList(text) {
        this.setState((state) => {
            return {...state, filter: text}
        })
    }

    render() {
        let services = [];
        services = this.state.services.map(((val, key) => {
            let renderIt = true;
            let filter = this.state.filter
            if (filter != "") {
                renderIt = false || val.name.includes(filter) || val.description.includes(filter) || val.meta.includes(filter)
            }

            if (!renderIt) return "";
            return (
                <Service key={key} {... val} filter={filter}/>
            )
        }).bind(this));


        services.filter(svc => svc != "");
        return (
            <div className="container mx-auto">
                <header className="border-b-2 pb-4 border-blue-100 px-3">
                    <h1 className="text-4xl font-bold my-3">API catalog</h1>
                    <input type="search" name="search" placeholder="Search" className={searchStyle} onChange={e => this.filterServiceList(e.target.value)}></input>
                </header>
                {services}
            </div>
        );
    }
}

export default Home