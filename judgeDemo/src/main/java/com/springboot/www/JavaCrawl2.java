package com.springboot.www;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.springboot.www.entity.News;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class JavaCrawl2 {

    private final static String url_prefix = "http://top.news.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=www_www_all_suda_suda&top_time=";
    private final static String url_suffix = "&top_show_num=100&top_order=DESC&js_var=all_1_data01";
    private final static String start_Date = "2024-09-25";
    private final static String end_Date = "2024-09-26";
    private final static String filePath = "D:\\news.txt";

    public static void main(String[] args) {
        System.out.println(getNews(start_Date,end_Date));
    }

    public static List<News> getNews(String start_Date, String end_Date) {
        System.out.println("0");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<News> newslist=new ArrayList<>();
        //起始日期
        try {
            Date startDate = sdf.parse(start_Date);
            //结束日期
            Date endDate = sdf.parse(end_Date);
            Date tempDate = startDate;

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            System.out.println("1");
            //循环
            while(tempDate.getTime() < endDate.getTime()) {
                tempDate = calendar.getTime();
                String date = sdf.format(tempDate);
                date = date.replace("-", "");
                //2020-03-28	20200328
                String url = url_prefix + date + url_suffix;
                System.out.println("2");
                List<News> list=doGet(url);
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                newslist.addAll(list);
                System.out.println("3");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return newslist;
    }

    public static List<News> doGet(String url) {
        //访问url，获取内容
        Document document = null;
        try {
            document = Jsoup.connect(url).get();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //System.out.println(document);
        //筛选出有用数据
        String body = document.select("body").html();
        //System.out.println(body);
        String subString = body.substring(19, body.length()-1);
        //System.out.println(subString);
        JSONObject json = JSONObject.parseObject(subString);
        //System.out.println(json);
        JSONArray jsonArray = json.getJSONArray("data");
        List<News> newslist= new ArrayList<>();
        for(Object object : jsonArray) {
            JSONObject news = (JSONObject)object;
            News anews=new News();
            anews.setTitle(news.getString("title"));
            anews.setPublish_at(java.sql.Date.valueOf(news.getString("create_date")));;
            String url2=news.getString("url");
            anews.setContent(desGetUrl(url2));
            newslist.add(anews);
        }
        return newslist;
    }

    public static String desGetUrl(String url) {
        String newText="";
        try {
            /*Document doc = Jsoup
                    .connect(url)
                    .userAgent(
                            "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; MALC)")
                    .get();*/
            Document doc = Jsoup.connect(url).get();
            // System.out.println(doc);
            // 得到html下的所有东西
            //Element content = doc.getElementById("article");
            Elements contents = doc.getElementsByClass("article");
            if(contents != null && contents.size() >0){
                Element content = contents.get(0);
                newText = content.text();
            }
            //System.out.println(content);
            //return newText;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return newText;
    }
}

