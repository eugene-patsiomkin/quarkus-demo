import { kongHost } from "../../helpers/service";

const kongAdminHost = kongHost;
const getAclGroup = (tags) => {
    if (!tags || tags.length < 1) {
        throw new Error('No acl info attached to a route.');
    }

    let groupTags = tags.filter(t => t.includes("group~authkey")); 
    if (groupTags.length < 1) {
        throw new Error('Rote is unaccessible through authkey.');
    }
    
    let aclTags = tags.filter(t => t.includes("acl~"));
    if (aclTags.length < 1) {
        throw new Error('No acl info attached to a route.');
    }

    return aclTags[0].replace("acl~", "");
}

const userExists = async userId => {
    const res = await fetch(`${kongAdminHost}/consumers/${userId}`);
    if (res.status >= 400) {
        throw new Error("Customer not found")
    }
}

const routeExists = async routeId => {
    const res = await fetch(`${kongAdminHost}/routes/${routeId}`);
    if (res.status >= 400) {
        throw new Error("Route not found")
    }
}

const authKey = {
    post: async (req, res) => {
        console.log(req.body);
        const SECONDS_IN_DAY = 86400;
        const DAYS_IN_MONTH = 31;
        const customerId = req.body.customer_id;
        const routeId = req.body.route_id;
        let duration  = parseInt(req.body.key_duration || SECONDS_IN_DAY, 10);
        if (duration > DAYS_IN_MONTH * SECONDS_IN_DAY) {
            duration = SECONDS_IN_DAY;
        } 


        console.log(`Duration:${duration}`)

        await Promise.all([
            userExists(customerId),
            routeExists(routeId)
        ]) ;

        const r = await fetch(`${kongAdminHost}/routes/${routeId}`);
        const d = await r.json();

        const aclGroup = getAclGroup(d.tags);
        await fetch(`${kongAdminHost}/consumers/${customerId}/acls`, {
            method: "POST",
            body: JSON.stringify({group: aclGroup}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // const rk = await fetch(`${kongAdminHost}/consumers/${customerId}/key-auth`);
        // let dk = await rk.json();
        let dk = {};
        // if (!dk || !dk.data || dk.data.length < 1) {
            const authKeyCreate = await fetch(`${kongAdminHost}/consumers/${customerId}/key-auth`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ttl: duration
                    , tags:["one_week_key", "auto_generated_key"]
                })
            });

            let newKey = await authKeyCreate.text();
            dk = {data:[JSON.parse(newKey)]}
        // }

        return dk.data[0].key;
    }
}

export default async function handler(req, res) {
    let method = req.method.toLowerCase();

    try {
        if (method in authKey) {
            let result = await authKey[method](req, res);
            res.status(200).json({key: result});
        } else {
            res.status(405).json({error: "Method Not Allowed"});
        }
    } catch (error) {
        res.status(500).json({error: "Server error", message: error.message});
    }
}