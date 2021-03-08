package org.yp.camel;

import java.util.HashMap;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;

/**
 * CamelIntegration
 */
public class CamelRest extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        from("direct:APIGetWeatherCanada").description("Weather Canada Data Access")
                .setHeader("ProvinceToGet", simple("${body}")).to("direct:getCityList").process(new XmlParser());

        from("direct:ReadWeatherFile").pollEnrich()
                .simple("file:${headers.CamelFilePath}?noop=true&idempotent=false").timeout(10).choice()
                .when(body().isNotNull())
                    .unmarshal().jacksonxml()
                    .process(
                        new Processor() {
                            @Override
                            public void process(Exchange exchange) throws Exception {
                                HashMap<String, Object> result = exchange.getMessage().getBody(HashMap.class);
                                Object cC = result.get("currentConditions");

                                if (!(cC instanceof HashMap)) { 
                                    exchange.getMessage().setBody(null);
                                    return;
                                }


                                HashMap<String, Object> currentConditions = (HashMap<String, Object>) cC;

                                Object t = currentConditions.get("temperature");
                                if (!(t instanceof HashMap)) { 
                                    exchange.getMessage().setBody(null);
                                    return;
                                }
                                
                                HashMap<String, String> temp = (HashMap<String, String>) currentConditions.get("temperature");
                                temp.put("value", temp.get(""));
                                temp.remove("");      
                                exchange.getMessage().setBody(temp);
                            }
                        }
                    )
                .endChoice()
                .otherwise()
                    .setBody().constant(null)
            .end()
        .end();
    }
}
