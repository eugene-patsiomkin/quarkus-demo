import App from "./App/app";
import GetServiceObject, {kongHost} from "../helpers/service";

const Index = (props) => (
    <App {... props}/>
)

export default Index

export async function getServerSideProps() {

    const res = await fetch(`${kongHost}/services?tags=type~docs`)
    const data = await res.json()
  
    if (!data) {
      return {
        notFound: true,
      }
    }

    let services = [];

    data.data.forEach(service => {
        services.push(GetServiceObject(service));
    });

    return {
        props: {
            services: services
        }
    }
}
  