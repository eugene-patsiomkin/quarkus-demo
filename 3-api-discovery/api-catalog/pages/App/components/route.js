import React, {Component} from "react"
import {AccessKey, RequestAccess} from "./accessKey"
import {serverHost, kongHost} from "../../../helpers/service";

const getType = tags => {
    return tags.filter(t => t.includes('group~'))[0].replace('group~', '');
};

class RouteInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    }

    componentDidMount() {
        this.getServerSideProps()
    }

    async getServerSideProps() {
        const res = await fetch(`${kongHost}/services/${this.state.service_name}/routes`);
        const data = await res.json();
        
        if (!data || !data.data || data.data.length < 1) {
            return {
                notFound: true,
            }
        }
        
        console.log(`${kongHost}/services/${this.state.service_name}/routes`);
        console.log(` Endpoints ${this.state.service_name} ${data.data.length}`)
        let routes = data.data.map((val, idx) => {
            this.setState((state, props) => {
                return { ...state, routes: []};
            });

            return {
                name: val.name,
                type: getType(val.tags),
                methods: val.methods,
                path: `${serverHost}${val.paths[0]}`
            };
        });

        this.setState((state, props) => {
            return { ...state, routes: routes};
        });
    }

    render() {
        let routes = [];

        if (this.state.routes) {
            routes = this.state.routes.map((route, idx) => {
                let methods = route.methods.map((m, i) => (
                    <span key={i} className="rounded-full bg-green-700 px-2 mr-2 font-bold text-xs text-white">{m}</span>
                ));

                return (
                    <div key={idx} className="p-3 space-y-2 rounded-md from-blue-50 to-green-50 bg-gradient-to-b bg-opacity-10 ">
                        <header className="text-xl font-bold">
                            {route.name}
                            <small className="ml-2 font-light">{route.type}</small>
                        </header>
                        <section>
                            <header className="font-bold mr-4">Path:</header>
                            {route.path}
                        </section>
                        <section>
                            <header className="font-bold mr-4">Methods</header>
                            {methods}
                        </section>
                        <section>
                            {
                                route.type.toLowerCase() == "cert" ?
                                    <RequestAccess route_id={route.name} /> : <AccessKey route_id={route.name} key_duration={604800}/>
                            }
                        </section>
                    </div>
                )
            });
        }

        return (
            <>
                {routes}
            </>
        );
    }
}

export default RouteInfo
