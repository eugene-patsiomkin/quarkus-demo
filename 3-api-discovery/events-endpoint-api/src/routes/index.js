import events from "./events.js";
import tags from "./tags.js";


const Routes = [
    {
        path: "/events",
        route: events
    },
    {
        path: "/event-tags",
        route: tags
    }
];

export default Routes;