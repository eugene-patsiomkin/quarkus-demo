package org.yp.camel;

public class SiteRequest {
    public String province;
    public String code;

    public SiteRequest() {}
    public SiteRequest(String province, String code) {
        this.province = province;
        this.code=code;
    }
}
