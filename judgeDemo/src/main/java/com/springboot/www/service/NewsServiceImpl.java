package com.springboot.www.service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import DiMvSCGE.Class1;
import JSMCFC.Classify;
import com.mathworks.toolbox.javabuilder.MWException;
import com.springboot.www.dao.NewsDao;
import com.springboot.www.dao.RecordDao;
import com.springboot.www.entity.News;
import com.springboot.www.entity.Record;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wltea.analyzer.core.IKSegmenter;
import org.wltea.analyzer.core.Lexeme;

import org.wltea.analyzer.core.IKSegmenter;
import org.wltea.analyzer.core.Lexeme;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {
    private String url_prefix = "http://top.news.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=www_www_all_suda_suda&top_time=";
    private String url_suffix = "&top_show_num=100&top_order=DESC&js_var=all_1_data01";
    @Autowired
    private NewsDao newsDao = new NewsDao();

    public List<News> getNews(String start_Date, String end_Date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<News> newslist = new ArrayList<>();
        //起始日期
        try {
            Date startDate = sdf.parse(start_Date);
            //结束日期
            Date endDate = sdf.parse(end_Date);
            Date tempDate = startDate;

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            //循环
            while (tempDate.getTime() <= endDate.getTime()) {
                String date = sdf.format(tempDate);
                date = date.replace("-", "");
                //2020-03-28	20200328
                String url = url_prefix + date + url_suffix;
                List<News> list = doGet(url);
                /*for(News item:list){
                    System.out.println(item.getContent());
                }*/
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                tempDate = calendar.getTime();
                newslist.addAll(list);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return newslist;
    }

    public List<News> doGet(String url) {
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
        String subString;
        List<News> newslist = new ArrayList<>();
        if (body.length() > 20) {
            subString = body.substring(19, body.length() - 1);
            //System.out.println(subString);
            JSONObject json = JSONObject.parseObject(subString);
            //System.out.println(json);
            JSONArray jsonArray = json.getJSONArray("data");
            for (Object object : jsonArray) {
                JSONObject news = (JSONObject) object;
                News anews = new News();
                anews.setTitle(news.getString("title"));
                anews.setPublish_at(java.sql.Date.valueOf(news.getString("create_date")));
                ;
                String url2 = news.getString("url");
                anews.setContent(desGetUrl(url2));
                newslist.add(anews);
            }
        }
        return newslist;
    }

    public String desGetUrl(String url) {
        String newText = "";
        try {
            Document doc = Jsoup.connect(url).get();
            // 得到html下的所有东西
            Elements contents = doc.getElementsByClass("article");
            if (contents != null && contents.size() > 0) {
                Element content = contents.get(0);
                newText = content.text();
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return newText;
    }

    public List<News> classifyWithLabel(List<News> news, int id, String method) {
        List<News> newsList = new ArrayList<>();
        try {
            String data = "";
            int i = 0;
            for (News anews : news) {
                String content = String.join("", anews.getContent().split("\n"));
                if (i == 0) {
                    data = content;
                } else {
                    data = data + "\n" + content;
                }
                i++;
            }

            String[] labels = {"体育", "财经", "房产", "家居", "教育", "科技", "时尚", "时政", "游戏", "娱乐"};
            Object[] result = null;
            if (method.equals("JSMCFC")) {
                Classify c = new Classify();
                String url = "E:/1多视图聚类/2实验/实验1-JSMC/JSMC-main11-特征级联系统2";
                result = c.JSMCFC_label(1, data, url);
            } else {
                Class1 t = new Class1();
                String url = "E:/1多视图聚类/2实验/MvSCEG/Code-for-MvSCGE-master-66";
                result = t.DiMvSCGE_label(1, data, url);
            }
            if (i == 1) {
                for (News anews : news) {
                    anews.setRecord_id(id);
                    anews.setType(labels[Integer.parseInt(result[0].toString())]);
                    newsList.add(anews);
                    break;
                }
            } else {
                String[] results = result[0].toString().substring(1, result[0].toString().length() - 1).split(" ");
                i = 0;
                for (News anews : news) {
                    anews.setRecord_id(id);
                    anews.setType(labels[Integer.parseInt(results[i])]);
                    newsList.add(anews);
                    i++;
                }
            }
        } catch (MWException e) {
            e.printStackTrace();
        }
        return newsList;
    }

    public List<News> classifyWithoutLabel(List<News> news, int record_id, int C, String method) {
        List<News> newsList = new ArrayList<>();
        try {
            String data = "";
            int i = 0;
            for (News anews : news) {
                String content = String.join("", anews.getContent().split("\n"));
                if (i == 0) {
                    data = content;
                } else {
                    data = data + "\n" + content;
                }
                i++;
            }
            Object[] result = null;
            if (method.equals("JSMCFC")) {
                Classify c = new Classify();
                String url = "E:/1多视图聚类/2实验/实验1-JSMC/JSMC-main11-特征级联系统2";
                double alpha = 10;
                double beta = 100;
                double lambda = 10;
                double gamma = 10;
                result = c.JSMCFC_nolabel(1, data, C, alpha, beta, lambda, gamma, url);
            } else {
                Class1 t = new Class1();
                String url = "E:/1多视图聚类/2实验/MvSCEG/Code-for-MvSCGE-master-66";
                double lambda = 0.01;
                double beta = 0.0007;
                double alpha = 5;
                result = t.DiMvSCGE_nolabel(1, data, C, lambda, beta, alpha, url);
            }
            //System.out.println(result[0]);
            if (i == 1) {
                for (News anews : news) {
                    anews.setRecord_id(record_id);
                    anews.setType("类别" + result[0]);
                    newsList.add(anews);
                    break;
                }
            } else {
                String[] results = result[0].toString().substring(1, result[0].toString().length() - 1).split(";");
                i = 0;
                for (News anews : news) {
                    anews.setRecord_id(record_id);
                    anews.setType("类别" + results[i]);
                    newsList.add(anews);
                    i++;
                }
            }
        } catch (MWException e) {
            e.printStackTrace();
        }
        return newsList;
    }
    public List<String> cut(String msg) throws IOException {
        StringReader sr=new StringReader(msg);
        IKSegmenter ik=new IKSegmenter(sr, true);
        Lexeme lex=null;
        List<String> list=new ArrayList<>();
        while((lex=ik.next())!=null){
            list.add(lex.getLexemeText());
        }
        return list;
    }
    public boolean containDigit(String text){
        Pattern pattern=Pattern.compile(".*\\d+.*");
        Matcher matcher=pattern.matcher(text);
        return  matcher.matches();
    }
    public String getKeywords(String text){
        try{
            //获取停用词列表
            String stop_word_path = "E:/1多视图聚类/4.4 算法在文本分类中的应用/自定义数据集/停用词.txt";
            Map<String, Integer> map = new HashMap<>();
            // 加载字典
            InputStreamReader isr = new InputStreamReader(new FileInputStream(stop_word_path), "UTF-8");
            BufferedReader br = new BufferedReader(isr);
            String line = "";
            while ((line = br.readLine()) != null) {
                map.put(line.trim(), 1);
            }
            // 关闭文件
            br.close();
            isr.close();
            //分词
            List<String> list= cut(text);
            //过滤
            Map<String,Integer> frequent=new HashMap<>();
            for(String str:list){
                if(str.length()>1 && !containDigit(str) && !map.containsKey(str)){
                    frequent.put(str,frequent.getOrDefault(str,0)+1);
                }
            }
            List<Map.Entry<String,Integer>> frequencyList=frequent.entrySet().stream()
                    .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
                    .limit(30)
                    .collect(Collectors.toList());
            return frequencyList.toString();
        }catch (Exception e){
            e.printStackTrace();
        }
        return "";
    }
    @Override
    public List<News> show(News news) {
        return newsDao.show(news);
    }
    @Override
    public List<News> findByType(News news) {
        return newsDao.findByType(news);
    }
    @Override
    public int add(List<News> newsList){ return newsDao.add(newsList);}
    @Override
    public int delete(int record_id){ return newsDao.deleteByRecord(record_id);}

}
