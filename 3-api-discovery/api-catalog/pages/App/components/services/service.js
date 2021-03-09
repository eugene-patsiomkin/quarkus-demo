import React, {Component} from "react";
import {kongHost, serverHost} from "../../../../helpers/service";
import Endpoints from "../endpoints"

const linkStyle = "inline-block hover:text-blue-900 hover:bg-blue-50 rounded-xs underline text-blue-500";

const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <> { parts.map((part, i) => 
        <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? 'bg-yellow-200 bg-opacity-40' : '' }>
            { part }
        </span>)
    } </>;
}

class ServiceInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({... nextProps});  
    }

    componentDidMount() {
        this.getServerSideProps()
    }

    async getServerSideProps() {
        const res = await fetch(`${kongHost}/services/${this.state.service_name}/routes?tags=type~documentation_link`)
        const data = await res.json()

        if (!data || !data.data || data.data.length < 1) {
            return {
                notFound: true,
            }
        }

        this.setState((state, props) => {
            return { ...state, document_link: `${serverHost}${data.data[0].paths[0]}/`};
        });
    }

    render() {
        let name = this.state.name || "N/A";
        let description = this.state.description || "N/A";
        let filter = this.state.filter || false

        if (filter) {
            name = highlightText(name, filter);
            description = highlightText(description, filter);
        }

        return (
            <section className="mt-4">
                <header className="font text-3xl mb-3">{name}</header>
                <main>
                    <section>
                        {description}
                        <p className="text-sm">
                            <a className={linkStyle} href={this.state.document_link} target="_blank">Documentation</a>
                        </p>
                    </section>
                    <div className="pt-3 md:space-x-0 lg:space-x-4 md:space-y-4 lg:space-y-0 grid lg:grid-cols-2 md:grid-cols-1">
                        <Endpoints endpoint_root={this.state.service_name} />
                    </div>
                </main>
            </section>
        );
    }
}

export default ServiceInfo
