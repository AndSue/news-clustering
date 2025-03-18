package com.springboot.www.service;

import com.springboot.www.entity.News;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public interface NewsService {
    List<News> getNews(String start_Date, String end_Date);

    List<News> doGet(String url);

    String desGetUrl(String url);

    int add(List<News> list);

    List<News> show(News news);

    List<News> findByType(News news);

    List<News> classifyWithLabel(List<News> news,int uid,String method);

    int delete(int record_id);

    List<News> classifyWithoutLabel(List<News> news, int record_id, int C,String method);
    List<String> cut(String msg) throws IOException;
    String getKeywords(String text);
}
