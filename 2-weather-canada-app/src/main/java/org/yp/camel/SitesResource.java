package org.yp.camel;

import java.util.HashMap;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/sites")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SitesResource {

    @Inject
    CamelContext context;

    @ConfigProperty(name = "application.destination")
    String destination;

    @GET
    @Path("/{province}")
    public List<Site> getListByProvince(@PathParam("province") String province) {
        ProducerTemplate template = context.createProducerTemplate();
        List<Site> siteList = (List<Site>) template.requestBody("direct:APIGetWeatherCanada", province);

        return siteList;
    }

    @POST
    @Path("/start-job/{province}")
    @Produces(MediaType.APPLICATION_JSON)
    public String StartJobByProvince(@PathParam("province") String province) {
        ProducerTemplate template = context.createProducerTemplate();
        template.asyncSendBody("seda:StartIngestionJob", province);
 
        return "Ok";
    }

    @GET
    @Path("/weather/{province}/{siteCode}/current/temperature")
    @Produces(MediaType.APPLICATION_JSON)
    public Object GetSiteWeather(@PathParam("province") String province, @PathParam("siteCode") String siteCode) {
        ProducerTemplate template = context.createProducerTemplate();
        Exchange exchange =  template.request("direct:ReadWeatherFile", new Processor() {

            @Override
            public void process(Exchange exchange) throws Exception {
                exchange.getIn().setHeader("CamelFilePath", destination + "/" + province.toUpperCase() + "/" + siteCode);
                exchange.getIn().setHeader("CamelFileName", "/current.xml");
            }
            
        });

        if (exchange.getMessage().getBody() == null) {
            throw new NotFoundException("Temperature not found");
        }

        HashMap<String, String> result = exchange.getMessage().getBody(new HashMap<String, String>().getClass());

        result.put("province", province.toUpperCase());
        result.put("siteCode", siteCode);
 
        return result;
    }
}