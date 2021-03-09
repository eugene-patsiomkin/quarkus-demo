package gov.bc.ca.moti;

import org.apache.camel.builder.RouteBuilder;

/**
 * CamelTimer
 */
public class CamelTimer extends RouteBuilder{

    @Override
    public void configure() {
        from("timer://myTimer?period={{timer.interval}}")
            .log("Hello I'm timer.  {{timer.interval}}ms");        
    }
}