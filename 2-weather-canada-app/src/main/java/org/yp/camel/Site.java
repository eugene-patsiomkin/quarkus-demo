package org.yp.camel;

public class Site {
    public String code;
    public String nameEn;
    public String nameFr;
    public String provinceCode;

    public Site() {}
    public Site(String code, String provinceCode, String nameEn,  String nameFr) {
        this.code=code;
        this.provinceCode=provinceCode;
        this.nameEn=nameEn;
        this.nameFr=nameFr;
    }

    public String getCode ()
    {
        return code;
    }

    public String getProvinceCode ()
    {
        return provinceCode;
    }

    public String getNameFr ()
    {
        return nameFr;
    }

    public String getNameEn ()
    {
        return nameEn;
    }

    @Override
    public String toString()
    {
        return "Site [code = "+code+", provinceCode = "+provinceCode+", nameFr = "+nameFr+", nameEn = "+nameEn+"]";
    }
}