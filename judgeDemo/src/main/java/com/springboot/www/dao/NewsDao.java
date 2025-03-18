package com.springboot.www.dao;

import com.springboot.www.entity.News;
import com.springboot.www.entity.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class NewsDao {
    @Autowired(required = false)
    JdbcTemplate jdbcTemplate;

    public int add(List<News> list){
        if(list.size()==0){
            return 0;
        }
        String sql="insert into news(record_id,title,content,type,publish_at) values";
        int i=0;
        for(News news:list) {
            if (i != 0) {
                sql = sql + ",";
            }
            sql = sql + "(" + news.getRecord_id();
            sql = sql + ",'" + news.getTitle()+"'";
            sql = sql + ",'" + news.getContent()+"'";
            sql = sql + ",'" + news.getType()+"'";
            sql = sql + ",'" + news.getPublish_at() + "')";
            i++;
        }
        return jdbcTemplate.update(sql);
    }

    public List<News> show(News news){
        String sql="select * from news";
        if(news.getRecord_id()!=0){
            sql=sql+" where record_id="+news.getRecord_id();
        }
        if(news.getRecord_id()!=0&&news.getContent()!=null){
            sql=sql+" and (content like '%"+news.getContent()+"%' or title like '%"+news.getContent()+"%')";
        }
        if(news.getRecord_id()!=0&&news.getType()!=null){
            sql=sql+" and type= '"+news.getType()+"'";
        }
        sql=sql+" order by type";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql);
        List<News> newsList=new ArrayList<>();
        for(Map<String,Object> map:list){
            News news1=new News();
            news1.setId((int) map.get("id"));
            news1.setRecord_id((int) map.get("record_id"));
            news1.setType((String) map.get("type"));
            news1.setContent((String) map.get("content"));
            news1.setTitle((String) map.get("title"));
            news1.setPublish_at((Date)map.get("publish_at"));
            news1.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            newsList.add(news1);
        }
        return newsList;
    }

    public List<News> findByType(News news){
        String sql="select * from news where record_id=? and type=?";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql,news.getRecord_id(),news.getType());
        List<News> newsList=new ArrayList<>();
        for(Map<String,Object> map:list){
            News news1=new News();
            news1.setId((int) map.get("id"));
            news1.setRecord_id((int) map.get("record_id"));
            news1.setType((String) map.get("type"));
            news1.setContent((String) map.get("content"));
            news1.setTitle((String) map.get("title"));
            news1.setPublish_at((Date)map.get("publish_at"));
            news1.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            newsList.add(news1);
        }
        return newsList;
    }

    public int deleteById(int id){
        return jdbcTemplate.update("delete from news where id=?",id);
    }

    public int deleteByRecord(int id){
        return jdbcTemplate.update("delete from news where record_id=?",id);
    }
}
